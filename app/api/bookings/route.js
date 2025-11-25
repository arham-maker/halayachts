import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { logger, formatErrorResponse, isProduction } from '@/lib/utils';
import { sendEmail, isEmailConfigured } from '@/lib/mail';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const bookingData = await request.json();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'charterType', 'passengers', 'yachtTitle', 'location'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Create new booking
    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();

    // Send notification emails (non-blocking)
    sendBookingNotification(savedBooking).catch((error) =>
      logger.error('Booking notification error:', error)
    );

    return NextResponse.json(
      { 
        success: true, 
        message: 'Booking submitted successfully',
        bookingId: savedBooking._id,
        bookingReference: savedBooking.bookingReference
      },
      { status: 201 }
    );

  } catch (error) {
    logger.error('Booking submission error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Booking reference already exists' 
        },
        { status: 400 }
      );
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { 
          success: false,
          error: `Validation error: ${errors.join(', ')}` 
        },
        { status: 400 }
      );
    }

    const errorResponse = isProduction()
      ? { success: false, error: 'Internal server error' }
      : { success: false, ...formatErrorResponse(error) };

    return NextResponse.json(
      errorResponse,
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve bookings
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    await connectToDatabase();

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Booking.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Error fetching bookings:', error);
    
    const errorResponse = isProduction()
      ? { success: false, error: 'Internal server error' }
      : { success: false, ...formatErrorResponse(error) };

    return NextResponse.json(
      errorResponse,
      { status: 500 }
    );
  }
}

// Email notification function
async function sendBookingNotification(booking) {
  if (!isEmailConfigured()) {
    logger.warn('Skipping booking notification email because SMTP is not configured');
    return;
  }

  const adminEmail =
    process.env.BOOKING_NOTIFICATION_EMAIL ||
    process.env.SMTP_FROM_EMAIL ||
    process.env.SMTP_USER;

  const customerName = `${booking.firstName} ${booking.lastName}`.trim();
  const subjectRef = booking.bookingReference || booking._id?.toString();

  const charterDates =
    booking.charterType === 'multiday'
      ? `${formatDate(booking.checkInDate)} → ${formatDate(booking.checkOutDate)}`
      : formatDate(booking.date);

  const adminHtml = `
    <h2>New Booking Request</h2>
    <p>A new booking enquiry has been submitted on the website.</p>
    <table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse;">
      <tbody>
        <tr><td><strong>Reference</strong></td><td>${subjectRef}</td></tr>
        <tr><td><strong>Yacht</strong></td><td>${booking.yachtTitle}</td></tr>
        <tr><td><strong>Charter Type</strong></td><td>${booking.charterType}</td></tr>
        <tr><td><strong>Location</strong></td><td>${booking.location}</td></tr>
        <tr><td><strong>Dates</strong></td><td>${charterDates}</td></tr>
        <tr><td><strong>Passengers</strong></td><td>${booking.passengers}</td></tr>
        <tr><td><strong>Guest</strong></td><td>${customerName}</td></tr>
        <tr><td><strong>Email</strong></td><td>${booking.email}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${booking.phone}</td></tr>
        ${
          booking.message
            ? `<tr><td><strong>Message</strong></td><td>${booking.message}</td></tr>`
            : ''
        }
      </tbody>
    </table>
  `;

  const customerHtml = `
    <p>Hi ${booking.firstName},</p>
    <p>Thank you for choosing Hala Yachts. We have received your booking enquiry and one of our charter experts will contact you shortly.</p>
    <p><strong>Summary</strong></p>
    <ul>
      <li>Reference: ${subjectRef}</li>
      <li>Yacht: ${booking.yachtTitle}</li>
      <li>Charter Type: ${booking.charterType}</li>
      <li>Location: ${booking.location}</li>
      <li>Dates: ${charterDates}</li>
      <li>Guests: ${booking.passengers}</li>
    </ul>
    <p>If you need immediate assistance please reply to this email or call us.</p>
    <p>— Team Hala Yachts</p>
  `;

  await Promise.all([
    sendEmail({
      to: adminEmail,
      subject: `New Booking Request • ${booking.yachtTitle}`,
      html: adminHtml,
      replyTo: booking.email,
    }),
    sendEmail({
      to: booking.email,
      subject: 'We received your booking request',
      html: customerHtml,
      replyTo: adminEmail,
    }),
  ]);
}

function formatDate(dateValue) {
  if (!dateValue) return 'TBD';
  try {
    return new Date(dateValue).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    logger.warn('Unable to format date', dateValue, error);
    return String(dateValue);
  }
}
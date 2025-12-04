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
      <div style="background:#f5f5f5;padding:24px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
          <div style="background:#111827;padding:18px 24px;border-bottom:1px solid #111827;">
            <h1 style="margin:0;font-size:18px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#fbbf24;">
              Hala Yachts
            </h1>
            <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">
              New booking request - Action Required
            </p>
          </div>
    
          <div style="padding:24px;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
              <div style="width:48px;height:48px;border-radius:50%;background:#f0f9ff;display:flex;align-items:center;justify-content:center;">
                <svg style="width:24px;height:24px;color:#0284c7;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 style="margin:0;font-size:18px;font-weight:600;color:#111827;">
                  New Booking Request
                </h2>
                <p style="margin:4px 0 0;font-size:14px;color:#6b7280;">
                  A new booking enquiry has been submitted on the website
                </p>
              </div>
            </div>
    
            <div style="margin-bottom:24px;padding:16px;background:#fef3c7;border-radius:8px;border:1px solid #fbbf24;">
              <div style="display:flex;align-items:center;gap:8px;">
                <svg style="width:18px;height:18px;color:#d97706;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style="font-size:14px;font-weight:600;color:#92400e;">Reference: ${subjectRef}</span>
              </div>
              <p style="margin:8px 0 0 0;font-size:13px;color:#92400e;line-height:1.5;">
                Please respond to this booking request within 24 hours.
              </p>
            </div>
    
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;">
              <div style="padding:16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
                <h3 style="margin:0 0 12px 0;font-size:14px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Booking Details</h3>
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;font-size:14px;color:#111827;">
                  <tbody>
                    <tr>
                      <td style="padding:6px 0;width:100px;color:#6b7280;font-weight:500;">Yacht</td>
                      <td style="padding:6px 0;font-weight:500;color:#111827;">${booking.yachtTitle}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;width:100px;color:#6b7280;font-weight:500;">Charter Type</td>
                      <td style="padding:6px 0;">
                        <span style="display:inline-block;padding:2px 8px;background:#e0e7ff;color:#3730a3;border-radius:4px;font-size:12px;font-weight:500;">
                          ${booking.charterType}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;width:100px;color:#6b7280;font-weight:500;">Location</td>
                      <td style="padding:6px 0;">${booking.location}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;width:100px;color:#6b7280;font-weight:500;">Passengers</td>
                      <td style="padding:6px 0;">
                        <span style="display:inline-flex;align-items:center;gap:4px;">
                          <svg style="width:14px;height:14px;color:#6b7280;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13-7.25a6 6 0 01-6.5 5.197" />
                          </svg>
                          ${booking.passengers}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;width:100px;color:#6b7280;font-weight:500;">Dates</td>
                      <td style="padding:6px 0;font-weight:500;color:#dc2626;">${charterDates}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
    
              <div style="padding:16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
                <h3 style="margin:0 0 12px 0;font-size:14px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Guest Details</h3>
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;font-size:14px;color:#111827;">
                  <tbody>
                    <tr>
                      <td style="padding:6px 0;width:80px;color:#6b7280;font-weight:500;">Name</td>
                      <td style="padding:6px 0;font-weight:500;color:#111827;">${customerName}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;width:80px;color:#6b7280;font-weight:500;">Email</td>
                      <td style="padding:6px 0;">
                        <a href="mailto:${booking.email}" style="color:#2563eb;text-decoration:none;">
                          ${booking.email}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;width:80px;color:#6b7280;font-weight:500;">Phone</td>
                      <td style="padding:6px 0;">
                        <a href="tel:${booking.phone}" style="color:#111827;text-decoration:none;">
                          ${booking.phone}
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
    
            ${
              booking.message
                ? `
                <div style="margin-bottom:24px;">
                  <h3 style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Guest Message</h3>
                  <div style="padding:12px 16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;color:#111827;white-space:pre-wrap;line-height:1.6;font-size:14px;">
                    ${booking.message}
                  </div>
                </div>
                `
                : ''
            }
    
            <div style="padding:16px;background:#dcfce7;border-radius:8px;border:1px solid #86efac;">
              <div style="display:flex;align-items:flex-start;gap:12px;">
                <svg style="width:20px;height:20px;color:#166534;flex-shrink:0;margin-top:2px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#166534;">
                    Ready for follow-up
                  </p>
                  <p style="margin:0;font-size:13px;color:#166534;line-height:1.5;">
                    Contact the guest within 24 hours to confirm availability and discuss next steps. Use the reference <strong>${subjectRef}</strong> in all communications.
                  </p>
                </div>
              </div>
            </div>
          </div>
    
          <div style="padding:14px 24px 18px;border-top:1px solid #e5e7eb;background:#f9fafb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;">
              You are receiving this email because you are listed as a booking contact for
              Hala Yachts. Reply directly to this email to contact the guest.
            </p>
          </div>
        </div>
      </div>
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
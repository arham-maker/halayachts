import { NextResponse } from 'next/server';
import { sendEmail, isEmailConfigured } from '@/lib/mail';
import { logger, formatErrorResponse, isProduction } from '@/lib/utils';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const inquiryData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'location', 'duration'];
    const missingFields = requiredFields.filter(field => !inquiryData[field]);
    
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
    if (!emailRegex.test(inquiryData.email)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    // Send inquiry email (non-blocking)
    sendInquiryEmail(inquiryData).catch((error) =>
      logger.error('Inquiry email error:', error)
    );

    return NextResponse.json(
      { 
        success: true, 
        message: 'Inquiry submitted successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    logger.error('Inquiry submission error:', error);
    
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
async function sendInquiryEmail(inquiry) {
  if (!isEmailConfigured()) {
    logger.warn('Skipping inquiry email because SMTP is not configured');
    return;
  }

  const adminEmail =
    process.env.CONTACT_NOTIFICATION_EMAIL ||
    process.env.BOOKING_NOTIFICATION_EMAIL ||
    process.env.SMTP_FROM_EMAIL ||
    process.env.SMTP_USER;

  const customerName = inquiry.name || 'N/A';
  const customerEmail = inquiry.email || 'N/A';
  const customerPhone = inquiry.phone || 'N/A';
  const location = inquiry.location || 'N/A';
  const duration = inquiry.duration || 'N/A';
  const message = inquiry.message || 'No message provided';

  const subject = `New Charter Inquiry from ${customerName}`;

  const html = `
    <div style="background:#f5f5f5;padding:24px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
        <div style="background:#111827;padding:18px 24px;border-bottom:1px solid #111827;">
          <h1 style="margin:0;font-size:18px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#fbbf24;">
            Hala Yachts
          </h1>
          <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">
            New Charter Inquiry
          </p>
        </div>
    
        <div style="padding:24px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
            <div style="width:48px;height:48px;border-radius:50%;background:#f0f9ff;display:flex;align-items:center;justify-content:center;">
              <svg style="width:24px;height:24px;color:#0284c7;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 style="margin:0;font-size:18px;font-weight:600;color:#111827;">
                Charter Inquiry Received
              </h2>
              <p style="margin:4px 0 0;font-size:14px;color:#6b7280;">
                A new charter inquiry has been submitted
              </p>
            </div>
          </div>
    
          <div style="padding:20px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;font-size:14px;color:#111827;">
              <tbody>
                <tr>
                  <td style="padding:10px 0;width:140px;color:#6b7280;font-weight:600;vertical-align:top;">Name:</td>
                  <td style="padding:10px 0;font-weight:500;color:#111827;">${customerName}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;width:140px;color:#6b7280;font-weight:600;vertical-align:top;">Email:</td>
                  <td style="padding:10px 0;">
                    <a href="mailto:${customerEmail}" style="color:#2563eb;text-decoration:none;font-weight:500;">${customerEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;width:140px;color:#6b7280;font-weight:600;vertical-align:top;">Phone:</td>
                  <td style="padding:10px 0;">
                    <a href="tel:${customerPhone}" style="color:#2563eb;text-decoration:none;font-weight:500;">${customerPhone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;width:140px;color:#6b7280;font-weight:600;vertical-align:top;">Location:</td>
                  <td style="padding:10px 0;font-weight:500;color:#111827;">${location}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;width:140px;color:#6b7280;font-weight:600;vertical-align:top;">Charter Duration:</td>
                  <td style="padding:10px 0;font-weight:500;color:#111827;">${duration}</td>
                </tr>
                ${message !== 'No message provided' ? `
                <tr>
                  <td style="padding:10px 0;width:140px;color:#6b7280;font-weight:600;vertical-align:top;">Message:</td>
                  <td style="padding:10px 0;font-weight:400;color:#111827;line-height:1.6;">${message.replace(/\n/g, '<br>')}</td>
                </tr>
                ` : ''}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  const text = `
Hala Yachts - New Charter Inquiry

Name: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone}
Location: ${location}
Charter Duration: ${duration}
${message !== 'No message provided' ? `Message: ${message}` : ''}
  `.trim();

  await sendEmail({
    to: adminEmail,
    subject,
    html,
    text,
    replyTo: customerEmail,
  });

  logger.log(`Inquiry email sent to ${adminEmail} for inquiry from ${customerName}`);
}


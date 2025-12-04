import { connectToDatabase } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { logger, formatErrorResponse, isProduction } from "@/lib/utils";
import { sendEmail, isEmailConfigured } from "@/lib/mail";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Save a new contact message
export async function POST(request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      countryCode,
      message,
    } = body || {};

    if (!firstName || !lastName || !email || !phone || !countryCode || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "All fields are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newMessage = await ContactMessage.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      countryCode: countryCode.trim(),
      message: message.trim(),
    });

    sendContactNotifications(newMessage).catch((error) =>
      logger.error("Contact notification error:", error)
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: newMessage._id.toString(),
          createdAt: newMessage.createdAt,
        },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    logger.error("Error saving contact message:", error);
    
    const errorResponse = isProduction()
      ? { success: false, error: "Failed to submit contact form" }
      : { success: false, ...formatErrorResponse(error) };

    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// (Optional) List messages for admin usage
export async function GET() {
  await connectToDatabase();

  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .lean();

    const formatted = messages.map((m) => ({
      id: m._id.toString(),
      firstName: m.firstName,
      lastName: m.lastName,
      email: m.email,
      phone: m.phone,
      countryCode: m.countryCode,
      message: m.message,
      isRead: m.isRead,
      createdAt: m.createdAt,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: formatted,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    logger.error("Error fetching contact messages:", error);
    
    const errorResponse = isProduction()
      ? { success: false, error: "Error fetching contact messages" }
      : { success: false, ...formatErrorResponse(error) };

    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function sendContactNotifications(messageDoc) {
  if (!isEmailConfigured()) {
    logger.warn("Skipping contact notification email because SMTP is not configured");
    return;
  }

  const adminEmail =
    process.env.CONTACT_NOTIFICATION_EMAIL ||
    process.env.SMTP_FROM_EMAIL ||
    process.env.SMTP_USER;

  const fullName = `${messageDoc.firstName} ${messageDoc.lastName}`.trim();
  const adminHtml = `
    <div style="background:#f5f5f5;padding:24px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
        <div style="background:#111827;padding:18px 24px;border-bottom:1px solid #111827;">
          <h1 style="margin:0;font-size:18px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#fbbf24;">
            Hala Yachts
          </h1>
          <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">
            New contact enquiry from the website
          </p>
        </div>

        <div style="padding:20px 24px 8px;">
          <h2 style="margin:0 0 8px;font-size:18px;font-weight:600;color:#111827;">
            New Contact Message
          </h2>
          <p style="margin:0 0 16px;font-size:14px;color:#4b5563;line-height:1.6;">
            A visitor has submitted the contact form. Here are the details:
          </p>

          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;font-size:14px;color:#111827;">
            <tbody>
              <tr>
                <td style="padding:6px 0;width:130px;color:#6b7280;font-weight:500;">Name</td>
                <td style="padding:6px 0;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;width:130px;color:#6b7280;font-weight:500;">Email</td>
                <td style="padding:6px 0;">
                  <a href="mailto:${messageDoc.email}" style="color:#2563eb;text-decoration:none;">
                    ${messageDoc.email}
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0;width:130px;color:#6b7280;font-weight:500;">Phone</td>
                <td style="padding:6px 0;">
                  <a href="tel:${messageDoc.countryCode}${messageDoc.phone}" style="color:#111827;text-decoration:none;">
                    ${messageDoc.countryCode} ${messageDoc.phone}
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0 2px;width:130px;color:#6b7280;font-weight:500;vertical-align:top;">Message</td>
                <td style="padding:6px 0 2px;">
                  <div style="padding:10px 12px;margin-top:2px;border-radius:8px;background:#f9fafb;border:1px solid #e5e7eb;color:#111827;white-space:pre-wrap;line-height:1.6;">
                    ${messageDoc.message}
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0 0;width:130px;color:#6b7280;font-weight:500;">Submitted</td>
                <td style="padding:10px 0 0;color:#4b5563;">${formatDate(messageDoc.createdAt)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="padding:14px 24px 18px;border-top:1px solid #e5e7eb;background:#f9fafb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;">
            You are receiving this email because you are listed as a contact for the
            Hala Yachts website. Reply directly to this email to contact the guest.
          </p>
        </div>
      </div>
    </div>
  `;

  const customerHtml = `
    <p>Hi ${messageDoc.firstName},</p>
    <p>Thank you for reaching out to Hala Yachts. Our concierge team has received your message and will reply shortly.</p>
    <p><strong>Your Message</strong></p>
    <blockquote>${messageDoc.message}</blockquote>
    <p>We look forward to assisting you.</p>
    <p>— Team Hala Yachts</p>
  `;

  await Promise.all([
    sendEmail({
      to: adminEmail,
      subject: "New contact message received",
      html: adminHtml,
      replyTo: messageDoc.email,
    }),
    sendEmail({
      to: messageDoc.email,
      subject: "We received your message",
      html: customerHtml,
      replyTo: adminEmail,
    }),
  ]);
}

function formatDate(dateValue) {
  if (!dateValue) return "TBD";
  try {
    return new Date(dateValue).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    logger.warn("Unable to format contact date", dateValue, error);
    return String(dateValue);
  }
}

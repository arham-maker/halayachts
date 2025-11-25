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
    <h2>New Contact Message</h2>
    <p>A visitor submitted the contact form.</p>
    <table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse;">
      <tbody>
        <tr><td><strong>Name</strong></td><td>${fullName}</td></tr>
        <tr><td><strong>Email</strong></td><td>${messageDoc.email}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${messageDoc.countryCode} ${messageDoc.phone}</td></tr>
        <tr><td><strong>Message</strong></td><td>${messageDoc.message}</td></tr>
        <tr><td><strong>Submitted</strong></td><td>${formatDate(messageDoc.createdAt)}</td></tr>
      </tbody>
    </table>
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

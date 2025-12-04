import { connectToDatabase } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import { logger, formatErrorResponse, isProduction } from "@/lib/utils";
import { sendEmail, isEmailConfigured } from "@/lib/mail";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(req) {
  await connectToDatabase();

  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ 
        success: false,
        error: "Valid email address is required" 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return new Response(JSON.stringify({ 
        success: false,
        error: "This email is already subscribed to Hala Yachts newsletter!" 
      }), { 
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const subscriber = await Subscriber.create({ email });

    sendNewsletterEmails(subscriber).catch((error) =>
      logger.error("Newsletter email error:", error)
    );
    
    return new Response(JSON.stringify({ 
      success: true,
      message: "Welcome to Hala Yachts! You have successfully subscribed to our luxury newsletter." 
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error("Newsletter subscription error:", error);
    
    const errorResponse = isProduction()
      ? { success: false, error: "We are experiencing technical issues. Please try again later." }
      : { success: false, ...formatErrorResponse(error) };

    return new Response(JSON.stringify(errorResponse), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function sendNewsletterEmails(subscriber) {
  if (!isEmailConfigured()) {
    logger.warn("Skipping newsletter emails because SMTP is not configured");
    return;
  }

  const adminEmail =
    process.env.NEWSLETTER_NOTIFICATION_EMAIL ||
    process.env.SMTP_FROM_EMAIL ||
    process.env.SMTP_USER;

    const adminHtml = `
    <div style="background:#f5f5f5;padding:24px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
        <div style="background:#111827;padding:18px 24px;border-bottom:1px solid #111827;">
          <h1 style="margin:0;font-size:18px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#fbbf24;">
            Hala Yachts
          </h1>
          <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">
            New newsletter subscription
          </p>
        </div>
  
        <div style="padding:24px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
            <div style="width:48px;height:48px;border-radius:50%;background:#fef3c7;display:flex;align-items:center;justify-content:center;">
              <svg style="width:24px;height:24px;color:#d97706;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 style="margin:0;font-size:18px;font-weight:600;color:#111827;">
                New Newsletter Subscriber
              </h2>
              <p style="margin:4px 0 0;font-size:14px;color:#6b7280;">
                Welcome a new member to the Hala Yachts community
              </p>
            </div>
          </div>
  
          <div style="padding:16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;margin-bottom:20px;">
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;font-size:14px;color:#111827;">
              <tbody>
                <tr>
                  <td style="padding:8px 0;width:100px;color:#6b7280;font-weight:500;vertical-align:top;">Email</td>
                  <td style="padding:8px 0;">
                    <a href="mailto:${subscriber.email}" style="color:#2563eb;text-decoration:none;font-weight:500;">
                      ${subscriber.email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;width:100px;color:#6b7280;font-weight:500;vertical-align:top;">Subscribed</td>
                  <td style="padding:8px 0;color:#4b5563;">
                    ${new Date(subscriber.createdAt).toLocaleString("en-US")}
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;width:100px;color:#6b7280;font-weight:500;vertical-align:top;">Status</td>
                  <td style="padding:8px 0;">
                    <span style="display:inline-block;padding:4px 10px;background:#dcfce7;color:#166534;border-radius:20px;font-size:12px;font-weight:500;">
                      Active
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <div style="margin-top:24px;padding:16px;background:#f0f9ff;border-radius:8px;border:1px solid #bae6fd;">
            <p style="margin:0;font-size:14px;color:#0369a1;line-height:1.6;">
              <strong>Next Step:</strong> Consider sending a welcome email to engage this new subscriber with your latest content or offers.
            </p>
          </div>
        </div>
  
        <div style="padding:14px 24px 18px;border-top:1px solid #e5e7eb;background:#f9fafb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;">
            You are receiving this email because you are listed as a contact for the
            Hala Yachts website. Manage subscribers in your newsletter dashboard.
          </p>
        </div>
      </div>
    </div>
  `;

  const customerHtml = `
    <p>Welcome aboard!</p>
    <p>Thank you for subscribing to the Hala Yachts newsletter. You'll now receive curated charter inspiration, destination highlights, and private offers straight to your inbox.</p>
    <p>We are delighted to share our world of luxury yachting with you.</p>
    <p>— Team Hala Yachts</p>
  `;

  await Promise.all([
    sendEmail({
      to: adminEmail,
      subject: "New newsletter subscriber",
      html: adminHtml,
      replyTo: subscriber.email,
    }),
    sendEmail({
      to: subscriber.email,
      subject: "You’re on the list — Hala Yachts newsletter",
      html: customerHtml,
      replyTo: adminEmail,
    }),
  ]);
}

export async function GET() {
  await connectToDatabase();

  try {
    const subscribersCount = await Subscriber.countDocuments();
    const recentSubscribers = await Subscriber.find()
      .sort({ createdAt: -1 })
      .limit(5);

    return new Response(JSON.stringify({ 
      success: true,
      data: {
        totalSubscribers: subscribersCount,
        recentSubscribers: recentSubscribers.map(sub => ({
          email: sub.email,
          subscribedAt: sub.createdAt
        }))
      }
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error("Error fetching newsletter data:", error);
    
    const errorResponse = isProduction()
      ? { success: false, error: "Failed to fetch subscribers data" }
      : { success: false, ...formatErrorResponse(error) };

    return new Response(JSON.stringify(errorResponse), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
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
    <h2>New Newsletter Subscriber</h2>
    <p>${subscriber.email} just subscribed to the Hala Yachts newsletter.</p>
    <p>Subscribed at: ${new Date(subscriber.createdAt).toLocaleString("en-US")}</p>
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
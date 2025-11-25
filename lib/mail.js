import nodemailer from 'nodemailer';
import { logger } from './utils';

let transporterPromise;

function validateSmtpConfig() {
  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM_EMAIL'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    logger.warn(
      'SMTP not fully configured. Missing variables:',
      missing.join(', ')
    );
    return null;
  }

  return {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure:
      process.env.SMTP_SECURE === 'true' ||
      (process.env.SMTP_SECURE === undefined && Number(process.env.SMTP_PORT) === 465),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
}

async function createTransporter() {
  const config = validateSmtpConfig();
  if (!config) {
    return null;
  }

  const transporter = nodemailer.createTransport(config);
  await transporter.verify();
  logger.log('SMTP transporter verified');
  return transporter;
}

async function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = createTransporter().catch((error) => {
      logger.error('Failed to initialize SMTP transporter:', error);
      transporterPromise = null;
      return null;
    });
  }
  return transporterPromise;
}

export function isEmailConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM_EMAIL
  );
}

function buildFromAddress() {
  const fromName = process.env.SMTP_FROM_NAME || 'Hala Yachts';
  const fromEmail = process.env.SMTP_FROM_EMAIL;
  return `${fromName} <${fromEmail}>`;
}

function toPlainText(html = '') {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function sendEmail({ to, subject, html, text, replyTo, cc, bcc, from }) {
  const transporter = await getTransporter();

  if (!transporter) {
    logger.warn('Email not sent because SMTP is not configured');
    return false;
  }

  const mailOptions = {
    from: from || buildFromAddress(),
    to,
    subject,
    html,
    text: text || toPlainText(html),
    replyTo,
    cc,
    bcc,
  };

  await transporter.sendMail(mailOptions);
  logger.log(`Email sent to ${to} with subject "${subject}"`);
  return true;
}



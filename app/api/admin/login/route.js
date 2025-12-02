import { NextResponse } from 'next/server';
import { logger, formatErrorResponse, isProduction } from '@/lib/utils';
import { connectToDatabase } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Rate limiting for login attempts
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

function checkLoginRateLimit(ip) {
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || { count: 0, lockoutUntil: 0 };

  if (attempts.lockoutUntil > now) {
    return false;
  }

  if (attempts.count >= MAX_ATTEMPTS) {
    attempts.lockoutUntil = now + LOCKOUT_TIME;
    loginAttempts.set(ip, attempts);
    return false;
  }

  return true;
}

function recordFailedAttempt(ip) {
  const attempts = loginAttempts.get(ip) || { count: 0, lockoutUntil: 0 };
  attempts.count += 1;
  loginAttempts.set(ip, attempts);
}

function resetAttempts(ip) {
  loginAttempts.delete(ip);
}

function getJwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    if (isProduction()) {
      throw new Error('ADMIN_JWT_SECRET or JWT_SECRET must be set in production for admin authentication');
    }

    // In development we fall back to a static secret to simplify setup,
    // but this MUST NOT be used in production.
    logger.warn('Using insecure default JWT secret in development. Set ADMIN_JWT_SECRET or JWT_SECRET.');
    return 'insecure-dev-secret-change-me';
  }

  return secret;
}

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Check rate limit
    if (!checkLoginRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const admin = await Admin.findOne({ email: email.toLowerCase().trim(), isActive: true });

    if (!admin) {
      recordFailedAttempt(ip);
      logger.warn(`Failed admin login (unknown email) from IP: ${ip}`);

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!passwordValid) {
      recordFailedAttempt(ip);
      logger.warn(`Failed admin login (invalid password) from IP: ${ip}`);

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Successful login, reset attempts
    resetAttempts(ip);

    const jwtSecret = getJwtSecret();

    const token = jwt.sign(
      {
        sub: admin._id.toString(),
        email: admin.email,
        role: admin.role,
      },
      jwtSecret,
      {
        expiresIn: '7d',
      }
    );

    logger.log(`Admin login successful from IP: ${ip}`);

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    // Set HTTP-only cookie for session management
    response.cookies.set('hala_admin_token', token, {
      httpOnly: true,
      secure: isProduction(),
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    logger.error('Login error:', error);
    
    const errorResponse = isProduction()
      ? { error: 'Internal server error' }
      : formatErrorResponse(error);

    return NextResponse.json(
      errorResponse,
      { status: 500 }
    );
  }
}
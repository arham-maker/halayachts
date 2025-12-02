import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { isProduction, logger } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function getJwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    if (isProduction()) {
      throw new Error('ADMIN_JWT_SECRET or JWT_SECRET must be set in production for admin authentication');
    }

    logger.warn('Using insecure default JWT secret in development. Set ADMIN_JWT_SECRET or JWT_SECRET.');
    return 'insecure-dev-secret-change-me';
  }

  return secret;
}

export async function GET(request) {
  try {
    const token = request.cookies.get('hala_admin_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const jwtSecret = getJwtSecret();
    const payload = jwt.verify(token, jwtSecret);

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: payload.sub,
          email: payload.email,
          role: payload.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    logger.warn('Failed to verify admin session token', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}



import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { logger, formatErrorResponse, isProduction } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectToDatabase();

    const existingCount = await Admin.countDocuments({});

    // Simple safety: only allow browser-based registration if no admin exists yet
    if (existingCount > 0) {
      return NextResponse.json(
        { error: 'Registration is disabled because an admin account already exists.' },
        { status: 403 }
      );
    }

    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: 'An admin with this email already exists' },
        { status: 409 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      email: normalizedEmail,
      passwordHash,
      name: name?.trim() || 'Hala Yachts Admin',
      role: 'admin',
      isActive: true,
    });

    logger.log('Admin registered via /api/admin/register:', admin.email);

    return NextResponse.json(
      {
        success: true,
        message: 'Admin account created. You can now log in.',
        user: {
          email: admin.email,
          name: admin.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Admin registration error:', error);

    const errorResponse = isProduction()
      ? { error: 'Internal server error' }
      : formatErrorResponse(error);

    return NextResponse.json(errorResponse, { status: 500 });
  }
}



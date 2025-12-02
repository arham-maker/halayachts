import { NextResponse } from 'next/server';
import { isProduction } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear the admin auth cookie by setting it to an expired date
  response.cookies.set('hala_admin_token', '', {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });

  return response;
}



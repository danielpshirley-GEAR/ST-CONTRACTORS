import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials, getAdminToken, ADMIN_TOKEN_COOKIE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || !validateAdminCredentials(password)) {
      return NextResponse.json(
        { success: false, error: 'Invalid password. Please check your credentials.' },
        { status: 401 }
      );
    }

    const token = getAdminToken();
    const response = NextResponse.json({ success: true });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: ADMIN_TOKEN_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Authentication error' }, { status: 500 });
  }
}

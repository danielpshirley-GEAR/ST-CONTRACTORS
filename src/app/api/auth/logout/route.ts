import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_TOKEN_COOKIE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const response = NextResponse.redirect(new URL('/admin/login', req.url));
  response.cookies.delete(ADMIN_TOKEN_COOKIE);
  return response;
}

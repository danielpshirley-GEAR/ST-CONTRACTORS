import { NextRequest, NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customer-auth';

export async function GET(req: NextRequest) {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      phone: session.user.phone,
      postcode: session.user.postcode,
      createdAt: session.user.createdAt,
    },
  });
}

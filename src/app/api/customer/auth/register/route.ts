import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, createCustomerToken, CUSTOMER_COOKIE_NAME } from '@/lib/customer-auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, postcode, pendingProject, pendingCalculation } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const passwordHash = hashPassword(password);
    const user = await db.createCustomerUser({
      name,
      email,
      phone,
      postcode,
      passwordHash,
    });

    let savedProject = null;
    let savedCalculation = null;

    // Seamlessly persist pending estimate if created before registration
    if (pendingProject && pendingProject.inputData && pendingProject.scopeItems && pendingProject.estimateResult) {
      savedProject = await db.saveProjectForCustomer(user.id, pendingProject);
    }

    // Seamlessly persist pending trade calculation if saved before registration
    if (pendingCalculation && pendingCalculation.calculatorSlug && pendingCalculation.outputs) {
      savedCalculation = await db.saveCalculationForCustomer(user.id, pendingCalculation);
    }

    const token = createCustomerToken(user.id, user.email);
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        postcode: user.postcode,
      },
      savedProject,
      savedCalculation,
    });

    response.cookies.set({
      name: CUSTOMER_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to register account' }, { status: 400 });
  }
}

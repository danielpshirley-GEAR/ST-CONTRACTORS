import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCustomerSession } from '@/lib/customer-auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { calculator, qualification, contact } = body;

    if (!calculator || !qualification || !contact) {
      return NextResponse.json(
        { error: 'Missing calculation, project qualification, or contact details' },
        { status: 400 }
      );
    }

    if (!contact.firstName || !contact.lastName || !contact.email || !contact.phone) {
      return NextResponse.json(
        { error: 'First name, last name, email, and phone number are required' },
        { status: 400 }
      );
    }

    if (!qualification.postcode) {
      return NextResponse.json(
        { error: 'Project postcode or location is required' },
        { status: 400 }
      );
    }

    // Optional customer session linking
    let userId: string | undefined = undefined;
    try {
      const customerSession = await getCustomerSession();
      if (customerSession?.user) {
        userId = customerSession.user.id;
      }
    } catch (e) {
      // Ignore if not logged in
    }

    const { lead, project, consultation } = await db.createLeadFromCalculatorConsultation({
      calculator,
      qualification,
      contact,
      userId,
    });

    // Log analytics conversion event
    await db.logAnalyticsEvent({
      sessionId: `sess_calc_${Date.now()}`,
      eventName: 'calculator_consultation_booked',
      category: 'Conversion',
      label: calculator.name,
      value: lead.estimatedValue,
      metadata: {
        score: lead.score,
        scoreBand: lead.scoreBand,
        postcode: lead.postcode,
        calculatorSlug: calculator.slug,
        formattedPrimary: calculator.formattedPrimary,
      },
    });

    return NextResponse.json({
      success: true,
      referenceCode: lead.referenceCode,
      leadId: lead.id,
      projectId: project.id,
      consultationId: consultation.id,
      leadScore: lead.score,
      scoreBand: lead.scoreBand,
      consultationType: lead.consultationType,
      message: 'Priority consultation successfully booked. Our senior surveyor will contact you shortly.',
    });
  } catch (error: any) {
    console.error('Error in /api/calculator-consultation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit consultation booking' },
      { status: 500 }
    );
  }
}

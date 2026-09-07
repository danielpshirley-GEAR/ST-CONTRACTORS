import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { dispatchLeadWebhook } from '@/lib/crm/webhook-dispatcher';
import { routeLeadByScoreBand } from '@/lib/leads/lead-router';

const visualiserLeadSchema = z.object({
  contact: z.object({
    name: z.string().min(2, 'Please provide your full name'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(8, 'Please enter a valid telephone number'),
    preferredContactMethod: z.enum(['phone', 'email', 'whatsapp']).default('phone'),
    postcode: z.string().optional(),
    message: z.string().optional(),
    consent: z.boolean().refine((val) => val === true, {
      message: 'You must agree to be contacted regarding your project',
    }),
  }),
  state: z.record(z.string(), z.any()),
  attribution: z
    .object({
      utmSource: z.string().optional(),
      utmMedium: z.string().optional(),
      utmCampaign: z.string().optional(),
      utmContent: z.string().optional(),
      landingPage: z.string().optional(),
      referrer: z.string().optional(),
      deviceCategory: z.enum(['mobile', 'tablet', 'desktop']).optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const validation = visualiserLeadSchema.safeParse(rawBody);

    if (!validation.success) {
      console.warn('[API/LEADS/VISUALISER] Validation failure:', validation.error.issues);
      const firstError = validation.error.errors[0]?.message || 'Invalid lead submission data';
      return NextResponse.json({ error: firstError, issues: validation.error.issues }, { status: 400 });
    }

    const { contact, state, attribution } = validation.data;

    // Persist full lead and project state with zero re-entry loss
    const { lead, project } = await db.createLeadFromVisualiser({
      state: state as any,
      contact,
      attribution,
    });

    // Record commercial conversion analytics event
    const sessionId =
      req.cookies.get('st_session_id')?.value ||
      req.cookies.get('apex_session_id')?.value ||
      `sess_${Date.now()}`;

    await db.logAnalyticsEvent({
      sessionId,
      eventName: 'consultation_submitted',
      category: 'Commercial',
      label: lead.projectType,
      value: lead.estimatedValue,
      metadata: {
        leadId: lead.id,
        referenceCode: lead.referenceCode,
        score: lead.score,
        scoreBand: lead.scoreBand,
        projectType: lead.projectType,
        postcode: lead.postcode,
      },
    });

    // Dispatch webhook to CRM / internal team
    try {
      await dispatchLeadWebhook({
        event: 'consultation_requested',
        lead,
      });
    } catch (whErr) {
      console.warn('CRM webhook dispatch notification:', whErr);
    }

    const routing = routeLeadByScoreBand(lead.scoreBand);

    return NextResponse.json({
      success: true,
      referenceCode: lead.referenceCode,
      leadId: lead.id,
      projectId: project.id,
      scoreBand: lead.scoreBand,
      nextStep: routing.customerNextStep,
    });
  } catch (error) {
    console.error('Visualiser lead conversion failure:', error);
    return NextResponse.json(
      { error: 'Failed to process project review request. Please try again or call us directly.' },
      { status: 500 }
    );
  }
}

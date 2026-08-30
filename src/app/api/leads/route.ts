import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateFullRoomQuote } from '@/lib/pricing/room-estimator';
import {
  ComprehensivePlannerInput,
  ProjectScopeItem,
  RecommendedWorkItem,
} from '@/lib/ai/types';
import { dispatchLeadWebhook } from '@/lib/crm/webhook-dispatcher';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      inputData,
      scopeItems,
      recommendations,
      contact,
      source,
    } = body as {
      inputData: ComprehensivePlannerInput;
      scopeItems: ProjectScopeItem[];
      recommendations: RecommendedWorkItem[];
      contact: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        preferredContactMethod: 'phone' | 'email';
        consultationType: 'consultation' | 'callback' | 'site_visit';
        requestedDate?: string;
        requestedTimeSlot?: string;
        notes?: string;
      };
      source?: string;
    };

    if (!inputData || !contact) {
      return NextResponse.json(
        { error: 'Missing project configuration or contact details' },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, phone } = contact;
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Please provide your first name, last name, email, and phone number' },
        { status: 400 }
      );
    }

    // Always recalculate on server side for deterministic consistency
    const serverEstimate = calculateFullRoomQuote(inputData, scopeItems || [], recommendations || []);

    // Store lead and project in database
    const { lead, project } = await db.createLeadWithRoomProject({
      inputData,
      scopeItems: scopeItems || [],
      recommendations: recommendations || [],
      estimateResult: serverEstimate,
      contact,
      source: source || 'AI Typeform Project Planner',
    });

    // Log conversion event
    await db.logAnalyticsEvent({
      sessionId: `sess-${Date.now()}`,
      eventName: 'lead_captured',
      category: 'Conversion',
      label: lead.projectType,
      value: lead.estimatedValue,
      metadata: {
        score: lead.score,
        scoreBand: lead.scoreBand,
        postcode: lead.postcode,
      },
    });

    // Dispatch webhook to CRM / Slack
    await dispatchLeadWebhook({
      event: 'consultation_requested',
      lead,
    });

    return NextResponse.json({
      success: true,
      referenceCode: lead.referenceCode,
      leadId: lead.id,
      projectId: project.id,
      estimate: {
        title: serverEstimate.projectTitle,
        costRange: `£${serverEstimate.indicativeCostLow.toLocaleString()} – £${serverEstimate.indicativeCostHigh.toLocaleString()}`,
        durationWeeks: `${serverEstimate.durationWeeksMin}–${serverEstimate.durationWeeksMax} weeks`,
        averageCost: serverEstimate.averageCost,
      },
      consultation: {
        type: lead.consultationType,
        requestedDate: lead.requestedDate,
        requestedTimeSlot: lead.requestedTimeSlot,
      },
    });
  } catch (error) {
    console.error('Error creating lead from room project:', error);
    return NextResponse.json(
      { error: 'Failed to process project quote & consultation request' },
      { status: 500 }
    );
  }
}

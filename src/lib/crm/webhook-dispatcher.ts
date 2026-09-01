/**
 * Phase 9: CRM & Webhook Notification Dispatcher
 * Dispatches lead events, consultation bookings, and stage transitions to CRM webhooks.
 */

import { DbLead } from '@/lib/db/schema';
import { LeadQualificationResult } from './qualification';

export interface WebhookLeadPayload {
  event: 'lead_created' | 'consultation_requested' | 'stage_changed';
  leadId: string;
  referenceCode: string;
  customerName: string;
  phone: string;
  email: string;
  projectType: string;
  borough?: string;
  estimatedValueGbp: number;
  score: number;
  scoreBand: string;
  stage: string;
  timestamp: string;
}

export async function dispatchLeadWebhook(params: {
  event: WebhookLeadPayload['event'];
  lead: DbLead;
  qualification?: LeadQualificationResult;
}): Promise<boolean> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;

  const payload: WebhookLeadPayload = {
    event: params.event,
    leadId: params.lead.id,
    referenceCode: params.lead.referenceCode || `ST-2026-${params.lead.id.slice(-4)}`,
    customerName: `${params.lead.firstName} ${params.lead.lastName}`,
    phone: params.lead.phone,
    email: params.lead.email,
    projectType: params.lead.projectType,
    borough: params.lead.postcode,
    estimatedValueGbp: params.lead.estimatedValue || 65000,
    score: params.qualification?.score || params.lead.score || 85,
    scoreBand: params.qualification?.scoreBand || params.lead.scoreBand || 'HOT',
    stage: params.lead.stage,
    timestamp: new Date().toISOString(),
  };

  // If no external webhook URL configured, log locally for audit trail
  if (!webhookUrl) {
    console.info('[CRM Dispatcher] Webhook event logged:', payload.event, payload.referenceCode, payload.scoreBand);
    return true;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-STContractors-Source': 'STContractorsPlatform',
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch (error) {
    console.error('[CRM Dispatcher] Error posting webhook:', error);
    return false;
  }
}

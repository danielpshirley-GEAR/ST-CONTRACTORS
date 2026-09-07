/**
 * Lead Routing Engine
 * Conforms to ST Contractors Phase 8 (Item 12)
 *
 * Automatically assigns internal operational priorities, response SLAs,
 * and follow-up pathways according to lead quality score band.
 *
 * RULE: Never reject legitimate customers solely because an automated score is low.
 */

import { LeadScoreBand } from '@/lib/pricing/types';

export interface LeadRoutingInstruction {
  scoreBand: LeadScoreBand;
  priority: 'URGENT' | 'HIGH' | 'STANDARD' | 'LOW' | 'ADVISORY';
  notificationChannel: 'IMMEDIATE_ALERT' | 'CRM_TASK' | 'NURTURE_SEQUENCE' | 'EDUCATIONAL' | 'GEOGRAPHIC_NOTICE';
  assignedRole: string;
  targetResponseHours: number;
  operationalAction: string;
  customerNextStep: string;
}

export function routeLeadByScoreBand(scoreBand: LeadScoreBand): LeadRoutingInstruction {
  switch (scoreBand) {
    case 'HOT':
      return {
        scoreBand: 'HOT',
        priority: 'URGENT',
        notificationChannel: 'IMMEDIATE_ALERT',
        assignedRole: 'Senior Surveyor / Estimating Director',
        targetResponseHours: 2,
        operationalAction:
          'High-value / high-intent lead. Immediate desktop feasibility assessment and direct phone call to arrange on-site feasibility survey.',
        customerNextStep:
          'A senior estimator is reviewing your project specification and will contact you within 2 hours to discuss feasibility.',
      };

    case 'STRONG':
    case 'HIGH':
      return {
        scoreBand: 'STRONG',
        priority: 'HIGH',
        notificationChannel: 'CRM_TASK',
        assignedRole: 'Project Estimator',
        targetResponseHours: 24,
        operationalAction:
          'Qualified project enquiry. Perform room-by-room scope review and schedule 30-minute technical consultation.',
        customerNextStep:
          'Our estimating team will review your project details and get in touch within 24 business hours to arrange your technical consultation.',
      };

    case 'DEVELOPING':
    case 'MEDIUM':
      return {
        scoreBand: 'DEVELOPING',
        priority: 'STANDARD',
        notificationChannel: 'NURTURE_SEQUENCE',
        assignedRole: 'Design & Pre-Construction Consultant',
        targetResponseHours: 48,
        operationalAction:
          'Scoping/feasibility stage lead. Provide tailored budget guidance and invite to explore design options before formal survey.',
        customerNextStep:
          'We have received your project details and will send a preliminary budget overview and planning considerations.',
      };

    case 'EARLY_STAGE':
    case 'EARLY':
      return {
        scoreBand: 'EARLY_STAGE',
        priority: 'LOW',
        notificationChannel: 'EDUCATIONAL',
        assignedRole: 'Client Onboarding / Automated Pathway',
        targetResponseHours: 72,
        operationalAction:
          'Early-stage enquiry. Provide London homeowner renovation planning guide, cost guides, and invite to revisit visual concepts.',
        customerNextStep:
          'Thank you for planning with ST Contractors. We have saved your project brief and will share our London Home Renovation Guide.',
      };

    case 'OUTSIDE_CRITERIA':
    default:
      return {
        scoreBand: 'OUTSIDE_CRITERIA',
        priority: 'ADVISORY',
        notificationChannel: 'GEOGRAPHIC_NOTICE',
        assignedRole: 'Customer Support Lead',
        targetResponseHours: 24,
        operationalAction:
          'Enquiry located outside primary London & South East operating zone. Review for exceptional projects or issue polite geographical advisory.',
        customerNextStep:
          'Our team has received your enquiry. Please note ST Contractors primarily serves London and South East England; our team will review coverage for your area.',
      };
  }
}

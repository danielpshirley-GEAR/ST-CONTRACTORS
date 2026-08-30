import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { generateRoomByRoomScope, generateContextualRecommendations } from '@/lib/ai/planner';
import { calculateFullRoomQuote } from '@/lib/pricing/room-estimator';
import { ComprehensivePlannerInput } from '@/lib/ai/types';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Please enter a valid telephone number'),
  postcode: z.string().optional(),
  projectType: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  inquiryType: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    const submission = await db.addContactSubmission({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      postcode: validatedData.postcode,
      projectType: validatedData.projectType,
      message: validatedData.message,
    });

    // Also add to lead pipeline if inquiry is for consultation
    if (validatedData.inquiryType === 'consultation') {
      const pType = validatedData.projectType || 'extension';
      const projectInput: ComprehensivePlannerInput = {
        projectType: pType,
        customDescription: validatedData.message,
        customerGoals: ['Modernise the property', 'Better layout'],
        propertyType: 'semi-detached',
        propertyAge: '1930_1960',
        postcode: validatedData.postcode || 'W5 2UP',
        selectedAreas: [{ id: 'area-1', name: 'Main Project Area', sizeCategory: 'medium' }],
        finishLevel: 'standard',
        projectStatus: 'starting_to_plan',
        timeline: '1_3_months',
        budgetRange: '50k_100k',
      };
      const scopeItems = generateRoomByRoomScope(projectInput);
      const recs = generateContextualRecommendations(projectInput);
      const estimate = calculateFullRoomQuote(projectInput, scopeItems, recs);

      await db.createLeadWithRoomProject({
        inputData: projectInput,
        scopeItems,
        recommendations: recs,
        estimateResult: estimate,
        contact: {
          firstName: validatedData.name.split(' ')[0] || validatedData.name,
          lastName: validatedData.name.split(' ').slice(1).join(' ') || 'Client',
          email: validatedData.email,
          phone: validatedData.phone,
          preferredContactMethod: 'phone',
          consultationType: 'consultation',
          notes: validatedData.message,
        },
        source: 'Contact Page Consultation Form',
      });
    }

    return NextResponse.json({ success: true, submissionId: submission.id });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Invalid form submission' },
        { status: 400 }
      );
    }
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again or call us directly.' },
      { status: 500 }
    );
  }
}

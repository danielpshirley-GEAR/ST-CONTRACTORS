/**
 * GET /api/visualiser/health
 * Internal provider healthcheck endpoint
 * Complies with Phase 7E Specification (Items 18, 19).
 * 
 * Verifies configured model availability without exposing secrets or credentials.
 */

import { NextResponse } from "next/server";
import { getProviderHealthReport } from "@/config/ai-models";

export async function GET() {
  try {
    const report = getProviderHealthReport();
    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Failed to generate health report",
      },
      { status: 500 }
    );
  }
}

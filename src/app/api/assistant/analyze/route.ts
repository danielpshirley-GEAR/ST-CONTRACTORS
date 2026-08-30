import { NextRequest, NextResponse } from 'next/server';
import { analyzeProjectWithAI } from '@/lib/assistant/analyzer';
import { db } from '@/lib/db';

// Simple in-memory rate limiting map (IP -> timestamp array)
const requestRateMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
    const now = Date.now();

    // Check rate limit
    const timestamps = requestRateMap.get(ip) || [];
    const recentTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

    if (recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait a moment before analyzing another project.',
        },
        { status: 429 }
      );
    }

    recentTimestamps.push(now);
    requestRateMap.set(ip, recentTimestamps);

    const body = await req.json().catch(() => ({}));
    const prompt = (body.prompt || '').trim();

    if (!prompt || prompt.length < 5) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide a clear description of your building or renovation project (at least 5 characters).',
        },
        { status: 400 }
      );
    }

    if (prompt.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project description is too long (maximum 2,000 characters).',
        },
        { status: 400 }
      );
    }

    // Perform extraction
    const project = await analyzeProjectWithAI(prompt);

    // Log analytics event
    try {
      await db.logAnalyticsEvent({
        eventName: 'assistant_project_analyzed',
        sessionId: req.headers.get('x-session-id') || 'ai-assistant-session',
        metadata: {
          projectType: project.projectType,
          roomsCount: project.rooms.length,
          likelyWorksCount: project.likelyWorks.length,
          promptSnippet: prompt.slice(0, 100),
        },
      });
    } catch {
      // Non-critical logging
    }

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error: any) {
    console.error('Error in /api/assistant/analyze:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred during project analysis.',
      },
      { status: 500 }
    );
  }
}

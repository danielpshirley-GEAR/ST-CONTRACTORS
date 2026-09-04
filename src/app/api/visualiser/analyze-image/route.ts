import { NextRequest, NextResponse } from 'next/server';
import { analyzeUploadedAsset } from '@/lib/ai/visualiser-ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, filename } = body;

    if (!url) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const asset = await analyzeUploadedAsset({
      url,
      filename: filename || 'uploaded-image.jpg',
    });

    return NextResponse.json({
      success: true,
      asset,
    });
  } catch (error) {
    console.error('Error analyzing image asset:', error);
    return NextResponse.json(
      { error: 'Failed to analyze uploaded asset' },
      { status: 500 }
    );
  }
}

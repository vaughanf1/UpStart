import { NextRequest, NextResponse } from 'next/server';
import claudeService from '@/services/claudeService';

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description) {
      return NextResponse.json(
        { success: false, error: 'Description is required' },
        { status: 400 }
      );
    }

    const analysis = await claudeService.analyzeIdea({
      description,
      title: 'Test Idea',
    });

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Claude test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to test Claude integration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
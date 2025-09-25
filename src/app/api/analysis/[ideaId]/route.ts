import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import claudeService from '@/services/claudeService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const { ideaId } = await params;

    // Get the idea from the database
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: {
        keywords: true,
        communitySignals: true,
      },
    });

    if (!idea) {
      return NextResponse.json(
        { success: false, error: 'Idea not found' },
        { status: 404 }
      );
    }

    // Check if analysis already exists (less than 1 hour old)
    const existingAnalysis = await prisma.analysis.findFirst({
      where: {
        ideaId: idea.id,
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingAnalysis) {
      return NextResponse.json({
        success: true,
        data: existingAnalysis.analysisData,
        cached: true,
      });
    }

    // Prepare data for Claude analysis
    const additionalData = {
      searchData: idea.keywords.map((k: any) => ({
        keyword: k.keyword,
        searchVolume: k.searchVolume,
        competition: k.competition,
        growthRate: k.growthRate,
      })),
      communityData: idea.communitySignals.map((cs: any) => ({
        platform: cs.platform,
        communityName: cs.communityName,
        memberCount: cs.memberCount,
        engagementScore: cs.engagementScore,
        sourceUrl: cs.sourceUrl,
      })),
      marketData: [], // TODO: Add market data when available
    };

    // Analyze with Claude
    const analysisResult = await claudeService.analyzeIdea({
      description: idea.description,
      title: idea.title,
      problem: idea.problem || undefined,
      solution: idea.solution || undefined,
      targetMarket: idea.targetMarket || undefined,
      revenueModel: idea.revenueModel || undefined,
      additionalData,
    });

    // Save analysis to database
    const savedAnalysis = await prisma.analysis.create({
      data: {
        ideaId: idea.id,
        opportunityScore: analysisResult.core_scoring.opportunity.score,
        problemScore: analysisResult.core_scoring.problem.score,
        feasibilityScore: analysisResult.core_scoring.feasibility.score,
        timingScore: analysisResult.core_scoring.why_now.score,
        revenueRange: analysisResult.business_fit.revenue_potential.range,
        executionDifficulty: analysisResult.business_fit.execution_difficulty.score,
        marketSize: null, // TODO: Extract from analysis if available
        competitionLevel: 'MEDIUM', // TODO: Extract from analysis
        analysisData: analysisResult as any,
      },
    });

    return NextResponse.json({
      success: true,
      data: analysisResult,
      cached: false,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze idea',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const { ideaId } = await params;

    const analysis = await prisma.analysis.findFirst({
      where: { ideaId },
      orderBy: { createdAt: 'desc' },
    });

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: 'No analysis found for this idea' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: analysis.analysisData,
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve analysis' },
      { status: 500 }
    );
  }
}
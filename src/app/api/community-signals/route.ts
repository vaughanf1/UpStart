import { NextRequest, NextResponse } from 'next/server';
import { CommunitySignalsService } from '@/services/communitySignals';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keywords = searchParams.get('keywords')?.split(',') || ['startup', 'business', 'SaaS', 'productivity'];
    const platform = searchParams.get('platform'); // Optional filter

    const communityService = new CommunitySignalsService();
    let signals = await communityService.collectSignalsForKeywords(keywords);

    // Filter by platform if specified
    if (platform) {
      signals = signals.filter(signal => signal.platform === platform);
    }

    // Limit results to prevent overwhelming the UI
    signals = signals.slice(0, 50);

    return NextResponse.json({
      success: true,
      data: {
        signals,
        totalCount: signals.length,
        platforms: ['reddit', 'hackernews', 'youtube'],
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching community signals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch community signals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { keywords, generateIdeas } = await request.json();

    if (!keywords || !Array.isArray(keywords)) {
      return NextResponse.json(
        { success: false, error: 'Keywords array is required' },
        { status: 400 }
      );
    }

    const communityService = new CommunitySignalsService();
    const signals = await communityService.collectSignalsForKeywords(keywords);

    let generatedIdeas = null;
    if (generateIdeas) {
      generatedIdeas = await generateIdeasFromSignals(signals);
    }

    return NextResponse.json({
      success: true,
      data: {
        signals: signals.slice(0, 20), // Limit for performance
        generatedIdeas,
        analysis: {
          totalSignals: signals.length,
          strongSignals: signals.filter(s => s.signalStrength >= 7).length,
          platforms: [...new Set(signals.map(s => s.platform))],
          topProblems: extractTopProblems(signals),
          sentiment: analyzeSentimentDistribution(signals)
        }
      }
    });
  } catch (error) {
    console.error('Error processing community signals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process community signals' },
      { status: 500 }
    );
  }
}

async function generateIdeasFromSignals(signals: any[]) {
  const topProblems = extractTopProblems(signals);
  const highEngagementSignals = signals
    .filter(s => s.signalStrength >= 6)
    .slice(0, 10);

  const prompt = `Based on these community signals and problems, generate 3 startup ideas:

Top Problems Identified:
${topProblems.map(p => `- ${p.problem} (mentioned ${p.count} times)`).join('\n')}

High Engagement Signals:
${highEngagementSignals.map(s =>
  `- "${s.title}" on ${s.platform} (Signal Strength: ${s.signalStrength})`
).join('\n')}

Generate 3 startup ideas that solve these real problems. For each idea provide:
1. Title
2. Problem it solves
3. Solution approach
4. Target market
5. Why community signals support this opportunity

Format as JSON array with these fields:
- title
- problem
- solution
- targetMarket
- communityEvidence
- signalStrength (1-10 based on community validation)
- estimatedARR`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
    return null;
  } catch (error) {
    console.error('Error generating ideas from signals:', error);
    return null;
  }
}

function extractTopProblems(signals: any[]) {
  const problemCounts: Record<string, number> = {};

  signals.forEach(signal => {
    signal.extractedProblems?.forEach((problem: string) => {
      const normalizedProblem = problem.toLowerCase().trim();
      problemCounts[normalizedProblem] = (problemCounts[normalizedProblem] || 0) + 1;
    });
  });

  return Object.entries(problemCounts)
    .map(([problem, count]) => ({ problem, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function analyzeSentimentDistribution(signals: any[]) {
  const sentiments = signals.reduce((acc, signal) => {
    acc[signal.sentiment] = (acc[signal.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = signals.length;
  return {
    positive: Math.round((sentiments.positive || 0) / total * 100),
    negative: Math.round((sentiments.negative || 0) / total * 100),
    neutral: Math.round((sentiments.neutral || 0) / total * 100)
  };
}
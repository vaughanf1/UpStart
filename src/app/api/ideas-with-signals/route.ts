import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { CommunitySignalsService } from '@/services/communitySignals';
import Anthropic from '@anthropic-ai/sdk';

const prisma = new PrismaClient();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function GET(request: NextRequest) {
  try {
    // Get all ideas from database
    const ideas = await prisma.idea.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        analyses: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        _count: {
          select: {
            analyses: true,
            keywords: true,
            communitySignals: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Collect community signals for relevant keywords
    const communityService = new CommunitySignalsService();
    const keywords = [
      'startup', 'business', 'SaaS', 'productivity', 'AI', 'automation',
      'finance', 'healthcare', 'education', 'e-commerce', 'sustainability',
      'fitness', 'mental health', 'remote work', 'development tools'
    ];

    const communitySignals = await communityService.collectSignalsForKeywords(keywords);

    // Match community signals to ideas using AI
    const ideasWithSignals = await Promise.all(
      ideas.map(async (idea) => {
        const matchingSignals = await findMatchingSignals(idea, communitySignals);

        return {
          ...idea,
          communityEvidence: matchingSignals.slice(0, 3), // Top 3 most relevant signals
          signalStrength: matchingSignals.length > 0
            ? Math.round(matchingSignals.reduce((acc, s) => acc + s.relevanceScore, 0) / matchingSignals.length)
            : 0,
          totalMatchingSignals: matchingSignals.length
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        ideas: ideasWithSignals,
        totalSignals: communitySignals.length,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching ideas with signals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ideas with community signals' },
      { status: 500 }
    );
  }
}

async function findMatchingSignals(idea: any, signals: any[]) {
  const ideaKeywords = extractIdeaKeywords(idea);
  const matchingSignals = [];

  for (const signal of signals) {
    const relevanceScore = calculateRelevance(idea, signal, ideaKeywords);

    if (relevanceScore >= 0.3) { // Threshold for relevance
      matchingSignals.push({
        ...signal,
        relevanceScore: Math.round(relevanceScore * 10), // Convert to 1-10 scale
        matchReason: generateMatchReason(idea, signal)
      });
    }
  }

  // Sort by relevance score
  return matchingSignals.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

function extractIdeaKeywords(idea: any): string[] {
  const text = `${idea.title} ${idea.description} ${idea.problem} ${idea.solution} ${idea.targetMarket}`.toLowerCase();

  const keywords = [
    // Tech keywords
    'ai', 'artificial intelligence', 'machine learning', 'automation', 'saas', 'platform', 'app', 'software',
    'mobile', 'web', 'api', 'analytics', 'dashboard', 'tool', 'system', 'service',

    // Business keywords
    'business', 'startup', 'entrepreneur', 'revenue', 'subscription', 'marketplace', 'e-commerce',
    'productivity', 'efficiency', 'workflow', 'management', 'optimization',

    // Industry keywords
    'healthcare', 'finance', 'education', 'fitness', 'food', 'travel', 'real estate',
    'energy', 'sustainability', 'environment', 'social', 'gaming', 'entertainment',

    // Problem keywords
    'problem', 'issue', 'challenge', 'difficulty', 'frustration', 'pain', 'struggle',
    'inefficient', 'time-consuming', 'expensive', 'complicated', 'manual'
  ];

  return keywords.filter(keyword => text.includes(keyword));
}

function calculateRelevance(idea: any, signal: any, ideaKeywords: string[]): number {
  let score = 0;

  // Title similarity
  const ideaTitle = idea.title.toLowerCase();
  const signalTitle = signal.title.toLowerCase();

  // Check for keyword matches
  for (const keyword of ideaKeywords) {
    if (signalTitle.includes(keyword) || signal.content?.toLowerCase().includes(keyword)) {
      score += 0.2;
    }
  }

  // Check extracted problems
  if (signal.extractedProblems) {
    for (const problem of signal.extractedProblems) {
      const problemLower = problem.toLowerCase();
      if (ideaKeywords.some(keyword => problemLower.includes(keyword))) {
        score += 0.3;
      }
    }
  }

  // Signal keywords match
  if (signal.keywords) {
    for (const signalKeyword of signal.keywords) {
      if (ideaKeywords.includes(signalKeyword)) {
        score += 0.1;
      }
    }
  }

  // Boost score for strong signals
  if (signal.signalStrength >= 7) {
    score += 0.1;
  }

  // Boost score for negative sentiment (indicates problems to solve)
  if (signal.sentiment === 'negative') {
    score += 0.1;
  }

  return Math.min(score, 1.0); // Cap at 1.0
}

function generateMatchReason(idea: any, signal: any): string {
  const reasons = [];

  if (signal.extractedProblems && signal.extractedProblems.length > 0) {
    reasons.push(`Addresses problem: "${signal.extractedProblems[0]}"`);
  }

  if (signal.platform === 'reddit') {
    reasons.push(`${signal.engagement.upvotes} upvotes on Reddit`);
  } else if (signal.platform === 'hackernews') {
    reasons.push(`${signal.engagement.upvotes} points on Hacker News`);
  }

  if (signal.signalStrength >= 8) {
    reasons.push('High community engagement');
  }

  return reasons.join(' • ') || 'Relevant community discussion';
}
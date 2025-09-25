import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { idea } = await request.json();

    if (!idea || typeof idea !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Idea is required and must be a string' },
        { status: 400 }
      );
    }

    // Generate comprehensive analysis of the startup idea
    const analysis = await analyzeStartupIdea(idea);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('Error in research-idea API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze the startup idea' },
      { status: 500 }
    );
  }
}

async function analyzeStartupIdea(idea: string) {
  const prompt = `Conduct a comprehensive analysis of this startup idea:

"${idea}"

Provide a detailed analysis covering:

1. Market Analysis
   - Market size estimation
   - Target market identification
   - Growth trends and opportunities

2. Competition Analysis
   - Identify 3-4 key competitors
   - Analyze their strengths and weaknesses
   - Identify opportunities for differentiation

3. Business Viability
   - Revenue model recommendations
   - Time to MVP estimate
   - Initial investment requirements
   - Revenue potential (ARR estimate)

4. Feasibility Assessment
   - Technical feasibility (1-10 scale)
   - Market opportunity score (1-10 scale)
   - Key success factors
   - Major risks and challenges

5. Strategic Recommendations
   - Next steps for validation
   - Key trends to leverage
   - Actionable insights

Format the response as JSON with this exact structure:
{
  "title": "Brief title for the idea",
  "marketSize": "Market size estimate (e.g., '$5B global market')",
  "competitionLevel": "Low" | "Medium" | "High",
  "opportunityScore": number (1-10),
  "feasibilityScore": number (1-10),
  "keyInsights": ["insight1", "insight2", "insight3"],
  "targetMarket": "Target market description",
  "revenueModel": "Revenue model description",
  "timeToMVP": "Time estimate (e.g., '4-6 months')",
  "estimatedARR": "Revenue estimate (e.g., '$500K - $2M ARR')",
  "keyTrends": ["trend1", "trend2", "trend3"],
  "competitorAnalysis": [
    {
      "name": "Competitor name",
      "description": "What they do",
      "weakness": "Their weakness/opportunity for you"
    }
  ],
  "risks": ["risk1", "risk2", "risk3"],
  "nextSteps": ["step1", "step2", "step3", "step4"]
}

Be specific, realistic, and actionable in your analysis. Focus on practical insights that would help an entrepreneur make informed decisions.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      // Parse the JSON response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        // Fallback parsing if JSON isn't wrapped properly
        return JSON.parse(content.text);
      }
    }
  } catch (error) {
    console.error('Error generating idea analysis:', error);

    // Fallback analysis if AI generation fails
    return {
      title: "Startup Idea Analysis",
      marketSize: "$1B+ addressable market",
      competitionLevel: "Medium",
      opportunityScore: 6,
      feasibilityScore: 7,
      keyInsights: [
        "Market validation is crucial before building",
        "Consider starting with a smaller, focused market segment",
        "User acquisition will be a key challenge to address early"
      ],
      targetMarket: "Digital-first consumers and early adopters",
      revenueModel: "Freemium model with premium subscriptions",
      timeToMVP: "4-6 months",
      estimatedARR: "$100K - $1M ARR",
      keyTrends: [
        "Growing demand for digital solutions",
        "Increased focus on user experience",
        "Mobile-first approach becoming essential"
      ],
      competitorAnalysis: [
        {
          name: "Generic Competitor A",
          description: "Established player with broad market presence",
          weakness: "Limited focus on user experience and modern interface"
        },
        {
          name: "Startup Competitor B",
          description: "Newer entrant with similar approach",
          weakness: "Lacks market penetration and brand recognition"
        }
      ],
      risks: [
        "Market saturation with similar solutions",
        "User acquisition costs may be high",
        "Technology development complexity"
      ],
      nextSteps: [
        "Conduct customer interviews to validate the problem",
        "Build a simple landing page to test interest",
        "Create a minimum viable prototype",
        "Develop a go-to-market strategy"
      ]
    };
  }
}
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface QuizAnswers {
  [questionId: string]: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { answers }: { answers: QuizAnswers } = await request.json();

    // Generate personalized startup ideas based on quiz answers
    const personalizedIdeas = await generatePersonalizedIdeas(answers);

    // For now, return the generated ideas directly
    // In production, you might want to store this in a session or database
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      success: true,
      sessionId,
      ideas: personalizedIdeas,
    });
  } catch (error) {
    console.error('Error in founder-fit API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate personalized ideas' },
      { status: 500 }
    );
  }
}

async function generatePersonalizedIdeas(answers: QuizAnswers) {
  // Convert answers to a readable format for the AI
  const formattedAnswers = Object.entries(answers).map(([questionId, answerArray]) => {
    const questionMap: Record<string, string> = {
      '1': 'Technical background',
      '2': 'Time commitment',
      '3': 'Industry interests',
      '4': 'Problem-solving preference',
      '5': 'Risk tolerance (1-10)',
      '6': 'Target customer segment',
      '7': 'Current skills',
      '8': 'Primary motivation'
    };

    return `${questionMap[questionId]}: ${answerArray.join(', ')}`;
  }).join('\n');

  const prompt = `Based on this founder's profile, generate 5 highly personalized startup ideas that match their skills, interests, and capabilities:

${formattedAnswers}

For each idea, provide:
1. A compelling title
2. A clear problem statement
3. The solution approach
4. Why this fits the founder's profile
5. Target market
6. Revenue model
7. Estimated time to MVP
8. Required initial investment range
9. Key success factors

Format as a JSON array with these fields:
- title (string)
- problem (string)
- solution (string)
- founderFit (string) - explain why this matches their profile
- targetMarket (string)
- revenueModel (string)
- timeToMVP (string)
- initialInvestment (string)
- keySuccessFactors (array of strings)
- estimatedARR (string) - realistic revenue potential

Make the ideas specific, actionable, and well-matched to their answers. Focus on realistic opportunities they could execute given their background.`;

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
      const jsonMatch = content.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        // Fallback parsing if JSON isn't wrapped properly
        return JSON.parse(content.text);
      }
    }
  } catch (error) {
    console.error('Error generating personalized ideas:', error);

    // Fallback ideas if AI generation fails
    return [
      {
        title: "AI-Powered Code Review Assistant",
        problem: "Manual code reviews are time-consuming and often miss critical issues",
        solution: "AI assistant that automatically reviews code commits and provides feedback",
        founderFit: "Matches your technical background and interest in solving developer problems",
        targetMarket: "Software development teams",
        revenueModel: "SaaS subscription per developer",
        timeToMVP: "3-6 months",
        initialInvestment: "$10K - $50K",
        keySuccessFactors: ["Integration with popular version control systems", "High accuracy in issue detection", "Developer adoption"],
        estimatedARR: "$100K - $1M ARR"
      }
    ];
  }
}
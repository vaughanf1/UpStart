import Anthropic from '@anthropic-ai/sdk';

export interface IdeaAnalysisInput {
  description: string;
  title?: string;
  problem?: string;
  solution?: string;
  targetMarket?: string;
  revenueModel?: string;
  additionalData?: {
    searchData?: any[];
    communityData?: any[];
    marketData?: any[];
  };
}

export interface IdeaAnalysisResult {
  idea_summary: {
    title: string;
    one_liner: string;
  };
  core_scoring: {
    opportunity: { score: number; rationale: string };
    problem: { score: number; rationale: string };
    feasibility: { score: number; rationale: string };
    why_now: { score: number; rationale: string };
  };
  business_fit: {
    revenue_potential: { range: string; rationale: string };
    execution_difficulty: { score: number; mvp_timeline: string; rationale: string };
    go_to_market: { score: number; strategy: string; rationale: string };
    founder_fit: { ideal_profile: string; rationale: string };
  };
  framework_analysis: {
    value_equation: { score: number; analysis: string };
    market_matrix: { positioning: string; analysis: string };
    acp_framework: {
      audience_score: number;
      community_score: number;
      product_score: number;
      analysis: string;
    };
    value_ladder: {
      bait: string;
      frontend: string;
      core_offer: string;
      backend: string;
      continuity: string;
      analysis: string;
    };
  };
  data_insights: {
    search_trends: string;
    community_feedback: string;
    market_data_summary: string;
  };
  final_recommendation: {
    verdict: 'Highly Recommended' | 'Proceed with Caution' | 'Not Recommended';
    summary: string;
  };
}

class ClaudeService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async analyzeIdea(input: IdeaAnalysisInput): Promise<IdeaAnalysisResult> {
    const prompt = this.buildAnalysisPrompt(input);

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4000,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const analysisText = response.content[0].text;
      return this.parseAnalysisResponse(analysisText);
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error('Failed to analyze idea with Claude: ' + (error as Error).message);
    }
  }

  private buildAnalysisPrompt(input: IdeaAnalysisInput): string {
    const { description, title, problem, solution, targetMarket, revenueModel, additionalData } = input;

    return `You are an expert startup analyst and venture capitalist. Your task is to conduct a comprehensive evaluation of a given business idea and provide a structured analysis in JSON format.

**Business Idea:** ${title || 'Untitled Idea'}

**Description:** ${description}

${problem ? `**Problem Statement:** ${problem}` : ''}
${solution ? `**Solution:** ${solution}` : ''}
${targetMarket ? `**Target Market:** ${targetMarket}` : ''}
${revenueModel ? `**Revenue Model:** ${revenueModel}` : ''}

**Additional Data:**
- **Search Volume Data:** ${JSON.stringify(additionalData?.searchData || [])}
- **Community Signals:** ${JSON.stringify(additionalData?.communityData || [])}
- **Market Research:** ${JSON.stringify(additionalData?.marketData || [])}

**Task:**
Analyze the provided business idea and generate a complete evaluation report in JSON format. The report must include:
1. **Core Scoring Metrics**: Opportunity, Problem, Feasibility, and Why Now scores (1-10).
2. **Business Fit Analysis**: Revenue Potential, Execution Difficulty, Go-To-Market, and Founder Fit.
3. **Data-Driven Analysis**: Incorporate any additional data provided.
4. **Framework Analysis**: Apply the Value Equation, Market Matrix, A.C.P., and Value Ladder frameworks.
5. **Detailed Explanations**: Provide clear rationale for each score and analysis point.

**JSON Output Schema:**
\`\`\`json
{
  "idea_summary": {
    "title": "A concise, compelling title for the idea",
    "one_liner": "A one-sentence summary of the business idea."
  },
  "core_scoring": {
    "opportunity": {
      "score": 7,
      "rationale": "Detailed explanation for the score."
    },
    "problem": {
      "score": 8,
      "rationale": "Detailed explanation for the score."
    },
    "feasibility": {
      "score": 6,
      "rationale": "Detailed explanation for the score."
    },
    "why_now": {
      "score": 7,
      "rationale": "Detailed explanation for the score."
    }
  },
  "business_fit": {
    "revenue_potential": {
      "range": "$1M-$5M ARR",
      "rationale": "Analysis of market size, pricing, and scalability."
    },
    "execution_difficulty": {
      "score": 6,
      "mvp_timeline": "3-6 months",
      "rationale": "Assessment of technical and operational challenges."
    },
    "go_to_market": {
      "score": 7,
      "strategy": "Primary GTM strategies (e.g., SEO, content marketing, partnerships).",
      "rationale": "Analysis of customer acquisition channels and market entry."
    },
    "founder_fit": {
      "ideal_profile": "Description of the ideal founder's skills and experience.",
      "rationale": "Why this profile is suited for this idea."
    }
  },
  "framework_analysis": {
    "value_equation": {
      "score": 7,
      "analysis": "Analysis of the value proposition and customer benefits."
    },
    "market_matrix": {
      "positioning": "Niche Player",
      "analysis": "Analysis of tech novelty vs. market category."
    },
    "acp_framework": {
      "audience_score": 7,
      "community_score": 6,
      "product_score": 8,
      "analysis": "Analysis of Audience, Community, and Product fit."
    },
    "value_ladder": {
      "bait": "Initial free offering.",
      "frontend": "Low-cost introductory product.",
      "core_offer": "Main product/service.",
      "backend": "High-ticket upsell.",
      "continuity": "Recurring revenue component.",
      "analysis": "Analysis of the monetization strategy and customer journey."
    }
  },
  "data_insights": {
    "search_trends": "Insights from search volume data.",
    "community_feedback": "Insights from community signals.",
    "market_data_summary": "Summary of market research findings."
  },
  "final_recommendation": {
    "verdict": "Highly Recommended",
    "summary": "A concluding summary of the idea's potential and key risks."
  }
}
\`\`\`

Please respond with valid JSON only, following the exact schema above.`;
  }

  private parseAnalysisResponse(responseText: string): IdeaAnalysisResult {
    try {
      // Extract JSON from response (handle potential markdown formatting)
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const parsed = JSON.parse(jsonStr);

      // Validate the structure has required fields
      if (!parsed.idea_summary || !parsed.core_scoring || !parsed.final_recommendation) {
        throw new Error('Invalid response structure from Claude');
      }

      return parsed as IdeaAnalysisResult;
    } catch (error) {
      console.error('Failed to parse Claude response:', error);
      console.error('Raw response:', responseText);
      throw new Error('Invalid response format from Claude: ' + (error as Error).message);
    }
  }

  async extractKeywords(ideaDescription: string): Promise<string[]> {
    const prompt = `Extract the 3-5 most important keywords from this business idea: "${ideaDescription}".

    Return as a JSON array of strings. For example: ["keyword1", "keyword2", "keyword3"]

    Only return the JSON array, nothing else.`;

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }]
      });

      const keywordsText = response.content[0].text;
      const jsonMatch = keywordsText.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (error) {
      console.error('Keyword extraction error:', error);
      return [];
    }
  }
}

export default new ClaudeService();
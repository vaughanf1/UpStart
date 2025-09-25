import { PrismaClient } from '@prisma/client';
import claudeService from '../src/services/claudeService';

const prisma = new PrismaClient();

async function batchAnalyze() {
  console.log('🤖 Starting batch analysis of ideas...');

  // Get all ideas that don't have analysis yet
  const ideas = await prisma.idea.findMany({
    where: {
      analyses: {
        none: {}
      }
    },
    include: {
      keywords: true,
      communitySignals: true,
    },
    take: 10, // Analyze first 10 ideas to start
  });

  console.log(`📊 Found ${ideas.length} ideas to analyze`);

  for (const [index, idea] of ideas.entries()) {
    console.log(`\n🔍 Analyzing ${index + 1}/${ideas.length}: ${idea.title}`);

    try {
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
      await prisma.analysis.create({
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

      console.log(`✅ Analysis completed for "${idea.title}"`);
      console.log(`   Scores: Opp ${analysisResult.core_scoring.opportunity.score}/10, Problem ${analysisResult.core_scoring.problem.score}/10, Feasibility ${analysisResult.core_scoring.feasibility.score}/10`);

      // Add a small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`❌ Failed to analyze "${idea.title}":`, error instanceof Error ? error.message : error);
      // Continue with next idea
    }
  }

  console.log('\n🎉 Batch analysis completed!');
}

batchAnalyze()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Batch analysis error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
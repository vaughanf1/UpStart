'use client';

import { Clock, TrendingUp, Users, Target, DollarSign, MessageSquare, ExternalLink, Shield } from 'lucide-react';

interface CommunityEvidence {
  id: string;
  platform: string;
  title: string;
  url: string;
  engagement: {
    upvotes?: number;
    comments?: number;
    likes?: number;
    views?: number;
  };
  relevanceScore: number;
  matchReason: string;
  signalStrength: number;
}

interface Idea {
  id: string;
  title: string;
  description: string;
  problem?: string;
  solution?: string;
  targetMarket?: string;
  revenueModel?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
  analyses: any[];
  _count: {
    analyses: number;
    keywords: number;
    communitySignals: number;
  };
  communityEvidence?: CommunityEvidence[];
  signalStrength?: number;
  totalMatchingSignals?: number;
}

interface IdeaCardProps {
  idea: Idea;
  onClick: () => void;
}

export default function IdeaCard({ idea, onClick }: IdeaCardProps) {
  const hasAnalysis = idea.analyses && idea.analyses.length > 0;
  const latestAnalysis = hasAnalysis ? idea.analyses[0] : null;
  const hasCommunityEvidence = idea.communityEvidence && idea.communityEvidence.length > 0;

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Generate ARR/MRR estimate based on analysis or fallback estimates
  const getRevenueEstimate = () => {
    if (hasAnalysis && latestAnalysis?.analysisData?.business_fit?.revenue_potential) {
      const revenueData = latestAnalysis.analysisData.business_fit.revenue_potential;
      if (revenueData.estimated_arr) {
        return revenueData.estimated_arr;
      }
      if (revenueData.range) {
        // Parse range like "$1M - $10M ARR" or "$50K - $500K MRR"
        const range = revenueData.range.toLowerCase();
        if (range.includes('arr')) {
          return revenueData.range;
        } else if (range.includes('mrr')) {
          // Convert MRR to ARR for consistency
          const numbers = range.match(/\d+/g);
          if (numbers && numbers.length >= 2) {
            const low = parseInt(numbers[0]) * 12;
            const high = parseInt(numbers[1]) * 12;
            return `$${low}K - $${high}K ARR`;
          }
        }
        return revenueData.range;
      }
    }

    // Fallback estimates based on target market and business model
    const market = idea.targetMarket?.toLowerCase() || '';
    const revenue = idea.revenueModel?.toLowerCase() || '';

    if (revenue.includes('subscription') || revenue.includes('saas')) {
      if (market.includes('enterprise') || market.includes('business')) {
        return '$500K - $5M ARR';
      } else {
        return '$100K - $1M ARR';
      }
    } else if (revenue.includes('marketplace') || revenue.includes('commission')) {
      return '$250K - $2M ARR';
    } else if (revenue.includes('advertising')) {
      return '$50K - $500K ARR';
    } else {
      return '$100K - $1M ARR';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 pr-3">
              {idea.title}
            </h3>
            <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
              <DollarSign className="h-3 w-3" />
              <span>{getRevenueEstimate()}</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
            {idea.description}
          </p>
        </div>
      </div>

      {/* Analysis Scores */}
      {hasAnalysis && latestAnalysis?.analysisData && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Opportunity</p>
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${getScoreColor(
                  latestAnalysis.analysisData.core_scoring?.opportunity?.score || 0
                )}`}
              >
                {latestAnalysis.analysisData.core_scoring?.opportunity?.score || 'N/A'}/10
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs text-gray-500">Feasibility</p>
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${getScoreColor(
                  latestAnalysis.analysisData.core_scoring?.feasibility?.score || 0
                )}`}
              >
                {latestAnalysis.analysisData.core_scoring?.feasibility?.score || 'N/A'}/10
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(idea.createdAt)}</span>
          </div>
          {idea.targetMarket && (
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span className="truncate max-w-20">{idea.targetMarket}</span>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div
            className={`h-2 w-2 rounded-full ${
              hasAnalysis ? 'bg-green-500' : 'bg-yellow-500'
            }`}
          />
          <span className="text-xs text-gray-500">
            {hasAnalysis ? 'Analyzed' : 'Pending Analysis'}
          </span>
        </div>

        {hasAnalysis && latestAnalysis?.analysisData?.final_recommendation && (
          <span className="text-xs font-medium text-blue-600">
            {latestAnalysis.analysisData.final_recommendation.verdict}
          </span>
        )}
      </div>

      {/* Revenue Potential */}
      {hasAnalysis && latestAnalysis?.analysisData?.business_fit?.revenue_potential && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Revenue Potential</span>
            <span className="text-sm font-medium text-gray-900">
              {latestAnalysis.analysisData.business_fit.revenue_potential.range}
            </span>
          </div>
        </div>
      )}

      {/* Community Evidence */}
      {hasCommunityEvidence && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-gray-500">Community Evidence</span>
            </div>
            <span className="text-xs font-medium text-blue-600">
              {idea.totalMatchingSignals} signals
            </span>
          </div>

          <div className="space-y-2">
            {idea.communityEvidence!.slice(0, 2).map((evidence, index) => {
              const getPlatformEmoji = (platform: string) => {
                switch (platform) {
                  case 'reddit': return '🔴';
                  case 'hackernews': return '🟠';
                  case 'youtube': return '🔴';
                  default: return '💬';
                }
              };

              return (
                <div key={evidence.id} className="bg-blue-50 p-2 rounded-md">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">{getPlatformEmoji(evidence.platform)}</span>
                      <span className="text-xs font-medium text-blue-800 truncate max-w-32">
                        {evidence.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className={`text-xs px-1 py-0.5 rounded ${getScoreColor(evidence.relevanceScore)}`}>
                        {evidence.relevanceScore}/10
                      </span>
                      <a
                        href={evidence.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                  <p className="text-xs text-blue-700">
                    {evidence.matchReason}
                  </p>
                </div>
              );
            })}
          </div>

          {idea.totalMatchingSignals! > 2 && (
            <p className="text-xs text-gray-500 mt-1 text-center">
              +{idea.totalMatchingSignals! - 2} more community signals
            </p>
          )}
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, TrendingUp, Target, Clock, DollarSign, Users, Lightbulb } from 'lucide-react';

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
}

interface IdeaDetailModalProps {
  idea: Idea;
  onClose: () => void;
}

export default function IdeaDetailModal({ idea, onClose }: IdeaDetailModalProps) {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const hasAnalysis = idea.analyses && idea.analyses.length > 0;

  useEffect(() => {
    if (hasAnalysis) {
      setAnalysisData(idea.analyses[0].analysisData);
    }
  }, [idea.analyses, hasAnalysis]);

  const runAnalysis = async () => {
    setAnalyzing(true);
    setError('');

    try {
      const response = await fetch(`/api/analysis/${idea.id}`, {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        setAnalysisData(result.data);
      } else {
        setError(result.error || 'Failed to analyze idea');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'Highly Recommended':
        return 'text-green-700 bg-green-100';
      case 'Proceed with Caution':
        return 'text-yellow-700 bg-yellow-100';
      case 'Not Recommended':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{idea.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Created by {idea.user.name || 'Anonymous'} • {new Date(idea.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Idea Details */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Idea Overview</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-600">{idea.description}</p>
              </div>

              {idea.problem && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Problem Statement</h4>
                  <p className="text-gray-600">{idea.problem}</p>
                </div>
              )}

              {idea.solution && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Proposed Solution</h4>
                  <p className="text-gray-600">{idea.solution}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {idea.targetMarket && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Target Market</h4>
                    <p className="text-gray-600">{idea.targetMarket}</p>
                  </div>
                )}

                {idea.revenueModel && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Revenue Model</h4>
                    <p className="text-gray-600">{idea.revenueModel}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Analysis Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">AI Analysis</h3>
              {!analysisData && (
                <button
                  onClick={runAnalysis}
                  disabled={analyzing}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors inline-flex items-center disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Run Analysis
                    </>
                  )}
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {analyzing && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Claude is analyzing your idea...</p>
                </div>
              </div>
            )}

            {analysisData && (
              <div className="space-y-6">
                {/* Core Scores */}
                {analysisData.core_scoring && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Core Scores</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">Opportunity</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-bold px-3 py-1 rounded-full ${getScoreColor(analysisData.core_scoring.opportunity?.score || 0)}`}>
                            {analysisData.core_scoring.opportunity?.score}/10
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">{analysisData.core_scoring.opportunity?.rationale}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="h-5 w-5 text-purple-500" />
                          <span className="text-sm font-medium text-gray-700">Problem</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-bold px-3 py-1 rounded-full ${getScoreColor(analysisData.core_scoring.problem?.score || 0)}`}>
                            {analysisData.core_scoring.problem?.score}/10
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">{analysisData.core_scoring.problem?.rationale}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="h-5 w-5 text-green-500" />
                          <span className="text-sm font-medium text-gray-700">Feasibility</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-bold px-3 py-1 rounded-full ${getScoreColor(analysisData.core_scoring.feasibility?.score || 0)}`}>
                            {analysisData.core_scoring.feasibility?.score}/10
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">{analysisData.core_scoring.feasibility?.rationale}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-5 w-5 text-orange-500" />
                          <span className="text-sm font-medium text-gray-700">Why Now</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-bold px-3 py-1 rounded-full ${getScoreColor(analysisData.core_scoring.why_now?.score || 0)}`}>
                            {analysisData.core_scoring.why_now?.score}/10
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">{analysisData.core_scoring.why_now?.rationale}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Business Fit */}
                {analysisData.business_fit && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Business Fit</h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Revenue Potential: </span>
                          <span className="text-sm font-bold text-green-600">
                            {analysisData.business_fit.revenue_potential?.range}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <div>
                          <span className="text-sm font-medium text-gray-700">MVP Timeline: </span>
                          <span className="text-sm font-bold text-blue-600">
                            {analysisData.business_fit.execution_difficulty?.mvp_timeline}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Final Recommendation */}
                {analysisData.final_recommendation && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Recommendation</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getVerdictColor(analysisData.final_recommendation.verdict)}`}>
                          {analysisData.final_recommendation.verdict}
                        </span>
                      </div>
                      <p className="text-gray-700">{analysisData.final_recommendation.summary}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!analysisData && !analyzing && (
              <div className="text-center py-8">
                <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Click "Run Analysis" to get AI insights on this idea</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
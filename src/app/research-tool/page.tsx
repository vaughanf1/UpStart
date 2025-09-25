'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { Search, TrendingUp, Users, DollarSign, Target, Clock, Lightbulb, ArrowRight } from 'lucide-react';

interface ResearchResult {
  title: string;
  marketSize: string;
  competitionLevel: 'Low' | 'Medium' | 'High';
  opportunityScore: number;
  feasibilityScore: number;
  keyInsights: string[];
  targetMarket: string;
  revenueModel: string;
  timeToMVP: string;
  estimatedARR: string;
  keyTrends: string[];
  competitorAnalysis: {
    name: string;
    description: string;
    weakness: string;
  }[];
  risks: string[];
  nextSteps: string[];
}

export default function ResearchTool() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/research-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.analysis);
      } else {
        console.error('Research failed:', data.error);
      }
    } catch (error) {
      console.error('Error researching idea:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCreateIdea={() => {}} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Research Your Idea</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enter your startup idea and get comprehensive AI-powered analysis including market research,
            competition analysis, and feasibility assessment.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">
                Describe Your Startup Idea
              </label>
              <textarea
                id="idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g., A mobile app that helps people find and book last-minute fitness classes at discounted rates..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !idea.trim()}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Researching Your Idea...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Research This Idea</span>
                </>
              )}
            </button>
          </form>

          {!result && !loading && (
            <div className="mt-8 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Market Analysis</h3>
                  <p className="text-sm text-gray-600">Market size, growth trends, and opportunity assessment</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Competition Research</h3>
                  <p className="text-sm text-gray-600">Competitor analysis and differentiation opportunities</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Feasibility Score</h3>
                  <p className="text-sm text-gray-600">Technical feasibility and execution difficulty assessment</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {result && (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Opportunity Score</p>
                    <div className={`text-2xl font-bold px-3 py-1 rounded-full inline-block mt-1 ${getScoreColor(result.opportunityScore)}`}>
                      {result.opportunityScore}/10
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Feasibility Score</p>
                    <div className={`text-2xl font-bold px-3 py-1 rounded-full inline-block mt-1 ${getScoreColor(result.feasibilityScore)}`}>
                      {result.feasibilityScore}/10
                    </div>
                  </div>
                  <Target className="h-8 w-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Market Size</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{result.marketSize}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Competition</p>
                    <div className={`text-2xl font-bold px-3 py-1 rounded-full inline-block mt-1 ${getCompetitionColor(result.competitionLevel)}`}>
                      {result.competitionLevel}
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                  <ul className="space-y-3">
                    {result.keyInsights.map((insight, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Target Market</h4>
                      <p className="text-gray-600">{result.targetMarket}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Revenue Model</h4>
                      <p className="text-gray-600">{result.revenueModel}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Time to MVP</h4>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{result.timeToMVP}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Est. Revenue</h4>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{result.estimatedARR}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Trends</h3>
                  <ul className="space-y-2">
                    {result.keyTrends.map((trend, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <ArrowRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{trend}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitor Analysis</h3>
                  <div className="space-y-4">
                    {result.competitorAnalysis.map((competitor, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{competitor.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{competitor.description}</p>
                        <div className="bg-green-50 p-2 rounded text-sm">
                          <span className="text-green-700 font-medium">Opportunity: </span>
                          <span className="text-green-600">{competitor.weakness}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Risks</h3>
                  <ul className="space-y-2">
                    {result.risks.map((risk, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Recommended Next Steps</h3>
                  <ol className="space-y-2">
                    {result.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="bg-blue-200 text-blue-800 font-medium text-xs px-2 py-1 rounded-full flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-blue-800">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import {
  TrendingUp,
  MessageCircle,
  Users,
  ExternalLink,
  Filter,
  Search,
  Lightbulb,
  BarChart3,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Minus,
  ArrowUp,
  ArrowDown,
  Eye
} from 'lucide-react';

interface CommunitySignal {
  id: string;
  platform: string;
  source: string;
  title: string;
  content: string;
  url: string;
  engagement: {
    upvotes?: number;
    comments?: number;
    likes?: number;
    shares?: number;
    views?: number;
  };
  sentiment: 'positive' | 'negative' | 'neutral';
  signalStrength: number;
  extractedProblems: string[];
  keywords: string[];
  createdAt: string;
}

interface CommunitySignalsData {
  signals: CommunitySignal[];
  totalCount: number;
  platforms: string[];
  lastUpdated: string;
}

interface SignalAnalysis {
  totalSignals: number;
  strongSignals: number;
  platforms: string[];
  topProblems: { problem: string; count: number }[];
  sentiment: { positive: number; negative: number; neutral: number };
}

export default function CommunitySignals() {
  const [data, setData] = useState<CommunitySignalsData | null>(null);
  const [analysis, setAnalysis] = useState<SignalAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchKeywords, setSearchKeywords] = useState('startup,business,SaaS,productivity');
  const [generatedIdeas, setGeneratedIdeas] = useState<any[]>([]);
  const [showIdeaGeneration, setShowIdeaGeneration] = useState(false);

  useEffect(() => {
    fetchCommunitySignals();
  }, []);

  const fetchCommunitySignals = async (keywords?: string) => {
    setLoading(true);
    try {
      const keywordParams = keywords || searchKeywords;
      const url = `/api/community-signals?keywords=${encodeURIComponent(keywordParams)}${
        selectedPlatform !== 'all' ? `&platform=${selectedPlatform}` : ''
      }`;

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching community signals:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateIdeasFromSignals = async () => {
    setShowIdeaGeneration(true);
    try {
      const response = await fetch('/api/community-signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: searchKeywords.split(',').map(k => k.trim()),
          generateIdeas: true
        })
      });

      const result = await response.json();
      if (result.success) {
        setGeneratedIdeas(result.data.generatedIdeas || []);
        setAnalysis(result.data.analysis);
      }
    } catch (error) {
      console.error('Error generating ideas from signals:', error);
    } finally {
      setShowIdeaGeneration(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'reddit': return '🔴';
      case 'hackernews': return '🟠';
      case 'youtube': return '🔴';
      default: return '💬';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case 'negative': return <ThumbsDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSignalStrengthColor = (strength: number) => {
    if (strength >= 8) return 'text-green-600 bg-green-100';
    if (strength >= 6) return 'text-yellow-600 bg-yellow-100';
    if (strength >= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const formatEngagement = (engagement: any) => {
    const metrics = [];
    if (engagement.upvotes) metrics.push(`${engagement.upvotes} upvotes`);
    if (engagement.comments) metrics.push(`${engagement.comments} comments`);
    if (engagement.likes) metrics.push(`${engagement.likes} likes`);
    if (engagement.views) metrics.push(`${engagement.views} views`);
    return metrics.join(' • ') || 'No engagement data';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onCreateIdea={() => {}} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Collecting community signals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCreateIdea={() => {}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Community Signals</h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            Real-time insights from Reddit, Hacker News, YouTube, and other communities to discover startup opportunities.
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchKeywords}
                  onChange={(e) => setSearchKeywords(e.target.value)}
                  placeholder="Enter keywords (comma separated)"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">All Platforms</option>
              <option value="reddit">Reddit</option>
              <option value="hackernews">Hacker News</option>
              <option value="youtube">YouTube</option>
            </select>

            <button
              onClick={() => fetchCommunitySignals()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Generate Ideas Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={generateIdeasFromSignals}
              disabled={showIdeaGeneration}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {showIdeaGeneration ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating Ideas...</span>
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4" />
                  <span>Generate Ideas from Signals</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Signals</p>
                  <p className="text-2xl font-bold text-gray-900">{data.totalCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <ArrowUp className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Strong Signals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.signals.filter(s => s.signalStrength >= 7).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Platforms</p>
                  <p className="text-2xl font-bold text-gray-900">{data.platforms.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Avg Strength</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(data.signals.reduce((acc, s) => acc + s.signalStrength, 0) / data.signals.length)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generated Ideas */}
        {generatedIdeas.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ideas Generated from Community Signals</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {generatedIdeas.map((idea, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{idea.title}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSignalStrengthColor(idea.signalStrength)}`}>
                      {idea.signalStrength}/10
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3">{idea.problem}</p>
                  <p className="text-gray-700 mb-4">{idea.solution}</p>

                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Community Evidence:</span> {idea.communityEvidence}
                    </p>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Target:</span> {idea.targetMarket}</p>
                    <p><span className="font-medium">Est. Revenue:</span> {idea.estimatedARR}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Overview */}
        {analysis && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Signal Analysis</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Problems Identified</h3>
                <div className="space-y-3">
                  {analysis.topProblems.slice(0, 5).map((problem, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{problem.problem}</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                        {problem.count} mentions
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ThumbsDown className="h-4 w-4 text-red-500" />
                      <span className="text-gray-700">Negative (Problems)</span>
                    </div>
                    <span className="font-medium">{analysis.sentiment.negative}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Minus className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">Neutral</span>
                    </div>
                    <span className="font-medium">{analysis.sentiment.neutral}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">Positive</span>
                    </div>
                    <span className="font-medium">{analysis.sentiment.positive}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Signals Feed */}
        {data && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Community Signals</h2>
            <div className="space-y-6">
              {data.signals.map((signal) => (
                <div key={signal.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getPlatformIcon(signal.platform)}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{signal.source}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-sm text-gray-500">
                            {new Date(signal.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {getSentimentIcon(signal.sentiment)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSignalStrengthColor(signal.signalStrength)}`}>
                            Signal: {signal.signalStrength}/10
                          </span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={signal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{signal.title}</h3>

                  {signal.content && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{signal.content}</p>
                  )}

                  {signal.extractedProblems.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Identified Problems:</h4>
                      <div className="space-y-1">
                        {signal.extractedProblems.slice(0, 2).map((problem, index) => (
                          <div key={index} className="bg-red-50 text-red-800 px-3 py-1 rounded-md text-sm">
                            {problem}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatEngagement(signal.engagement)}</span>
                    <div className="flex items-center space-x-2">
                      {signal.keywords.slice(0, 3).map((keyword, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data && data.signals.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No signals found</h3>
            <p className="text-gray-500">Try adjusting your keywords or platform filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
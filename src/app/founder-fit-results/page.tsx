'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import { Star, Clock, DollarSign, Target, Users, CheckCircle, ArrowRight } from 'lucide-react';

interface PersonalizedIdea {
  title: string;
  problem: string;
  solution: string;
  founderFit: string;
  targetMarket: string;
  revenueModel: string;
  timeToMVP: string;
  initialInvestment: string;
  keySuccessFactors: string[];
  estimatedARR: string;
}

export default function FounderFitResults() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const [ideas, setIdeas] = useState<PersonalizedIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState<PersonalizedIdea | null>(null);

  useEffect(() => {
    // In a real app, you'd fetch results by sessionId from your database
    // For now, we'll simulate this with localStorage or generate new ideas
    generateIdeas();
  }, [sessionId]);

  const generateIdeas = async () => {
    try {
      // For demo purposes, generate some sample personalized ideas
      const mockIdeas: PersonalizedIdea[] = [
        {
          title: "AI-Powered Personal Finance Coach",
          problem: "People struggle with financial planning and don't have access to personalized advice",
          solution: "AI coach that analyzes spending patterns and provides personalized financial recommendations",
          founderFit: "Perfect for your interest in AI/ML and helping solve consumer problems with technology",
          targetMarket: "Young professionals and millennials seeking financial guidance",
          revenueModel: "Freemium with premium subscription for advanced features",
          timeToMVP: "4-6 months",
          initialInvestment: "$25K - $75K",
          keySuccessFactors: ["Accurate financial analysis", "Engaging user experience", "Trust and data security"],
          estimatedARR: "$500K - $2M ARR"
        },
        {
          title: "Remote Team Productivity Analytics",
          problem: "Remote teams lack visibility into productivity patterns and collaboration effectiveness",
          solution: "Dashboard that analyzes team communication and work patterns to optimize remote collaboration",
          founderFit: "Leverages your technical skills and addresses the growing remote work market",
          targetMarket: "Remote-first startups and distributed teams",
          revenueModel: "SaaS subscription per team member",
          timeToMVP: "3-5 months",
          initialInvestment: "$15K - $40K",
          keySuccessFactors: ["Integration with popular tools", "Actionable insights", "Privacy compliance"],
          estimatedARR: "$200K - $1M ARR"
        },
        {
          title: "Sustainable Supply Chain Tracker",
          problem: "Companies struggle to track and verify sustainability claims across their supply chains",
          solution: "Platform that provides transparency and verification for sustainable business practices",
          founderFit: "Combines your interest in sustainability with business process optimization",
          targetMarket: "Mid-market companies with sustainability commitments",
          revenueModel: "Annual subscription plus verification fees",
          timeToMVP: "6-9 months",
          initialInvestment: "$50K - $150K",
          keySuccessFactors: ["Supplier network adoption", "Credible verification system", "Regulatory compliance"],
          estimatedARR: "$1M - $5M ARR"
        },
        {
          title: "Micro-Learning for Busy Professionals",
          problem: "Working professionals want to learn new skills but lack time for traditional courses",
          solution: "AI-curated 5-minute learning modules delivered during commute and break times",
          founderFit: "Matches your interest in education and solving time-constraint problems for professionals",
          targetMarket: "Working professionals seeking career advancement",
          revenueModel: "Monthly subscription with corporate packages",
          timeToMVP: "4-7 months",
          initialInvestment: "$30K - $80K",
          keySuccessFactors: ["Content quality", "Personalization accuracy", "Mobile-first experience"],
          estimatedARR: "$300K - $1.5M ARR"
        },
        {
          title: "Smart Parking Solution for Urban Areas",
          problem: "Urban parking is inefficient, causing traffic congestion and wasted time",
          solution: "IoT sensors and mobile app that help drivers find available parking spots in real-time",
          founderFit: "Great fit for your technical background and interest in solving urban infrastructure problems",
          targetMarket: "City governments and commercial parking operators",
          revenueModel: "Hardware sales plus software subscription",
          timeToMVP: "6-12 months",
          initialInvestment: "$100K - $300K",
          keySuccessFactors: ["Hardware reliability", "City partnerships", "User adoption"],
          estimatedARR: "$2M - $10M ARR"
        }
      ];

      setIdeas(mockIdeas);
    } catch (error) {
      console.error('Error loading ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your personalized ideas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Your Personalized Ideas</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Based on your founder fit quiz, we've generated {ideas.length} startup ideas perfectly matched to your skills, interests, and goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {ideas.map((idea, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedIdea(idea)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                      Personalized for You
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    <DollarSign className="h-3 w-3" />
                    <span>{idea.estimatedARR}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {idea.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {idea.problem}
                </p>

                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Why this fits you:</span> {idea.founderFit}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Time to MVP</p>
                      <p className="text-sm font-medium">{idea.timeToMVP}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Investment</p>
                      <p className="text-sm font-medium">{idea.initialInvestment}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <Users className="h-4 w-4 text-gray-500" />
                  <p className="text-sm text-gray-600 line-clamp-1">{idea.targetMarket}</p>
                </div>

                <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  <span>View Full Details</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedIdea && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedIdea.title}</h2>
                  <button
                    onClick={() => setSelectedIdea(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Problem & Solution</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Problem</h4>
                        <p className="text-gray-600">{selectedIdea.problem}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Solution</h4>
                        <p className="text-gray-600">{selectedIdea.solution}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Details</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Target Market</h4>
                        <p className="text-gray-600">{selectedIdea.targetMarket}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Revenue Model</h4>
                        <p className="text-gray-600">{selectedIdea.revenueModel}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Time to MVP</h4>
                          <p className="text-gray-600">{selectedIdea.timeToMVP}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Initial Investment</h4>
                          <p className="text-gray-600">{selectedIdea.initialInvestment}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold text-blue-900 mb-2">Why This Matches Your Profile</h4>
                    <p className="text-blue-800">{selectedIdea.founderFit}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Success Factors</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedIdea.keySuccessFactors.map((factor, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
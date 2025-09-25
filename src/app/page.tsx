'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import IdeaGrid from '@/components/ideas/IdeaGrid';
import CreateIdeaModal from '@/components/ideas/CreateIdeaModal';

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

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      // Use the new API that includes community signals
      const response = await fetch('/api/ideas-with-signals');
      const result = await response.json();

      if (result.success) {
        setIdeas(result.data.ideas);
      } else {
        console.error('Failed to fetch ideas:', result.error);
        // Fallback to regular ideas API if signals API fails
        const fallbackResponse = await fetch('/api/ideas');
        const fallbackResult = await fallbackResponse.json();
        if (fallbackResult.success) {
          setIdeas(fallbackResult.data.ideas);
        }
      }
    } catch (error) {
      console.error('Error fetching ideas:', error);
      // Fallback to regular ideas API
      try {
        const fallbackResponse = await fetch('/api/ideas');
        const fallbackResult = await fallbackResponse.json();
        if (fallbackResult.success) {
          setIdeas(fallbackResult.data.ideas);
        }
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIdeaCreated = (newIdea: Idea) => {
    setIdeas(prev => [newIdea, ...prev]);
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCreateIdea={() => setShowCreateModal(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Your Next Big Idea
          </h1>
          <p className="text-lg text-gray-600">
            Explore AI-analyzed startup ideas with market insights and feasibility scores.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <IdeaGrid ideas={ideas} />
        )}
      </main>

      {showCreateModal && (
        <CreateIdeaModal
          onClose={() => setShowCreateModal(false)}
          onIdeaCreated={handleIdeaCreated}
        />
      )}
    </div>
  );
}

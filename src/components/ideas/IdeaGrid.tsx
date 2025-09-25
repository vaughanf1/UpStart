'use client';

import { useState } from 'react';
import IdeaCard from './IdeaCard';
import IdeaDetailModal from './IdeaDetailModal';

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

interface IdeaGridProps {
  ideas: Idea[];
}

export default function IdeaGrid({ ideas }: IdeaGridProps) {
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  if (ideas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas yet</h3>
          <p className="text-gray-500 mb-6">
            Get started by submitting your first startup idea for AI analysis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onClick={() => setSelectedIdea(idea)}
          />
        ))}
      </div>

      {selectedIdea && (
        <IdeaDetailModal
          idea={selectedIdea}
          onClose={() => setSelectedIdea(null)}
        />
      )}
    </>
  );
}
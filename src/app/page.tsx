'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import IdeaGrid from '@/components/ideas/IdeaGrid';
import CreateIdeaModal from '@/components/ideas/CreateIdeaModal';

export default function HomePage() {
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/ideas')
      .then(res => res.json())
      .then(data => {
        setIdeas(data || []);
        setIsLoading(false);
      })
      .catch(() => {
        setIdeas([]);
        setIsLoading(false);
      });
  }, []);

  const handleCreateIdea = () => {
    setIsModalOpen(true);
  };

  const handleIdeaCreated = (newIdea) => {
    setIdeas(prev => [newIdea, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCreateIdea={handleCreateIdea} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Your Next Startup Idea
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse through curated startup ideas backed by real market research and community insights
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <IdeaGrid ideas={ideas} />
        )}
      </main>

      <CreateIdeaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onIdeaCreated={handleIdeaCreated}
      />
    </div>
  );
}
'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

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

interface CreateIdeaModalProps {
  onClose: () => void;
  onIdeaCreated: (idea: Idea) => void;
}

export default function CreateIdeaModal({ onClose, onIdeaCreated }: CreateIdeaModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    problem: '',
    solution: '',
    targetMarket: '',
    revenueModel: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        onIdeaCreated(result.data);
      } else {
        setError(result.error || 'Failed to create idea');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Submit New Idea</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Idea Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a compelling title for your idea"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your business idea in detail. What does it do? How does it work?"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-2">
              Problem Statement
            </label>
            <textarea
              id="problem"
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              placeholder="What specific problem does this idea solve?"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-2">
              Proposed Solution
            </label>
            <textarea
              id="solution"
              name="solution"
              value={formData.solution}
              onChange={handleChange}
              placeholder="How does your idea solve the problem?"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="targetMarket" className="block text-sm font-medium text-gray-700 mb-2">
                Target Market
              </label>
              <input
                type="text"
                id="targetMarket"
                name="targetMarket"
                value={formData.targetMarket}
                onChange={handleChange}
                placeholder="e.g., Small businesses, Students, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="revenueModel" className="block text-sm font-medium text-gray-700 mb-2">
                Revenue Model
              </label>
              <input
                type="text"
                id="revenueModel"
                name="revenueModel"
                value={formData.revenueModel}
                onChange={handleChange}
                placeholder="e.g., Subscription, One-time, Freemium"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors inline-flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Idea'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
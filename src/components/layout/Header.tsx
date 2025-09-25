'use client';

import { useState } from 'react';
import { Lightbulb, Plus, Search, Menu, X } from 'lucide-react';

interface HeaderProps {
  onCreateIdea?: () => void;
}

export default function Header({ onCreateIdea }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Lightbulb className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">UpStart</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              <a
                href="/"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Browse Ideas
              </a>
              <a
                href="/founder-fit-quiz"
                className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Founder Quiz
              </a>
              <a
                href="/research-tool"
                className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Research Tool
              </a>
              <a
                href="/community-signals"
                className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Community Signals
              </a>
            </nav>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search ideas..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
            </div>

            {/* CTA Button */}
            <button
              onClick={onCreateIdea}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Submit Idea
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
              <a
                href="/"
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              >
                Browse Ideas
              </a>
              <a
                href="/founder-fit-quiz"
                className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              >
                Founder Quiz
              </a>
              <a
                href="/research-tool"
                className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              >
                Research Tool
              </a>
              <a
                href="/community-signals"
                className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              >
                Community Signals
              </a>
              <div className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search ideas..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>
              <div className="px-3 py-2">
                <button
                  onClick={onCreateIdea}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Idea
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
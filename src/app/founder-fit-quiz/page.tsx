'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'scale';
  options: string[];
  category: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What is your technical background?',
    type: 'single',
    options: ['Strong technical (Software Engineer, Developer)', 'Moderate technical (Product Manager, Designer)', 'Non-technical (Business, Marketing, Sales)', 'Student/Learning'],
    category: 'skills'
  },
  {
    id: '2',
    question: 'How much time can you dedicate to a startup?',
    type: 'single',
    options: ['Full-time (40+ hours/week)', 'Part-time (20-40 hours/week)', 'Side project (5-20 hours/week)', 'Just exploring (<5 hours/week)'],
    category: 'commitment'
  },
  {
    id: '3',
    question: 'What industries interest you most? (Select all that apply)',
    type: 'multiple',
    options: ['Technology/SaaS', 'Healthcare', 'Finance/FinTech', 'Education', 'E-commerce', 'Sustainability/CleanTech', 'AI/Machine Learning', 'Gaming/Entertainment'],
    category: 'interests'
  },
  {
    id: '4',
    question: 'What type of problems do you prefer solving?',
    type: 'single',
    options: ['Technical/Engineering challenges', 'Business process inefficiencies', 'Consumer experience problems', 'Social/Environmental issues'],
    category: 'problem-solving'
  },
  {
    id: '5',
    question: 'How comfortable are you with uncertainty and risk?',
    type: 'scale',
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    category: 'risk-tolerance'
  },
  {
    id: '6',
    question: 'What is your preferred customer segment?',
    type: 'single',
    options: ['Individual consumers (B2C)', 'Small businesses (SMB)', 'Enterprise companies (B2B)', 'Other startups/developers'],
    category: 'market'
  },
  {
    id: '7',
    question: 'Which skills do you currently have? (Select all that apply)',
    type: 'multiple',
    options: ['Programming/Development', 'Design/UI-UX', 'Marketing/Growth', 'Sales', 'Data Analysis', 'Project Management', 'Finance/Accounting'],
    category: 'existing-skills'
  },
  {
    id: '8',
    question: 'What motivates you most?',
    type: 'single',
    options: ['Financial independence', 'Solving meaningful problems', 'Building innovative technology', 'Leading a team/company'],
    category: 'motivation'
  }
];

export default function FounderFitQuiz() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleAnswer = (questionId: string, answer: string, isMultiple = false) => {
    if (isMultiple) {
      const currentAnswers = answers[questionId] || [];
      const newAnswers = currentAnswers.includes(answer)
        ? currentAnswers.filter(a => a !== answer)
        : [...currentAnswers, answer];
      setAnswers(prev => ({ ...prev, [questionId]: newAnswers }));
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: [answer] }));
    }
  };

  const canProceed = () => {
    const question = quizQuestions[currentQuestion];
    const questionAnswers = answers[question.id] || [];
    return questionAnswers.length > 0;
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generatePersonalizedIdeas();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const generatePersonalizedIdeas = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/founder-fit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });

      const result = await response.json();
      if (result.success) {
        router.push(`/founder-fit-results?sessionId=${result.sessionId}`);
      } else {
        console.error('Failed to generate ideas:', result.error);
      }
    } catch (error) {
      console.error('Error generating ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Personalized Ideas</h2>
            <p className="text-gray-600">Analyzing your answers and finding the perfect startup ideas for you...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Lightbulb className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Founder Fit Quiz</h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            Answer a few questions to get personalized startup ideas that match your skills, interests, and goals.
          </p>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.type === 'scale' ? (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Not comfortable</span>
                <div className="flex space-x-2">
                  {question.options.map((option) => {
                    const isSelected = answers[question.id]?.includes(option);
                    return (
                      <button
                        key={option}
                        onClick={() => handleAnswer(question.id, option)}
                        className={`w-10 h-10 rounded-full border-2 font-medium transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 text-gray-700 hover:border-blue-300'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                <span className="text-sm text-gray-500">Very comfortable</span>
              </div>
            ) : (
              question.options.map((option, index) => {
                const isSelected = answers[question.id]?.includes(option);
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(question.id, option, question.type === 'multiple')}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 text-blue-900'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      {question.type === 'multiple' && (
                        <div className={`w-4 h-4 rounded border-2 mr-3 ${
                          isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      )}
                      {option}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="flex items-center px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              {currentQuestion === quizQuestions.length - 1 ? 'Generate Ideas' : 'Next'}
              {currentQuestion < quizQuestions.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
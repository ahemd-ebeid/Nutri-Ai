import React, { useState } from 'react';
import { useLanguage } from '../App';
import type { HealthTip, TipCategory } from '../types';
import { generateHealthTips } from '../services/geminiService';
import { Dumbbell, Sparkles, ChevronDown, Moon, Brain, Wind, Search } from './Icons';

const HealthTipsSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [tips, setTips] = useState<HealthTip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedTipIndex, setExpandedTipIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TipCategory>('fitness');
  const [tipsCategory, setTipsCategory] = useState<TipCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories: TipCategory[] = ['fitness', 'mentalWellness', 'sleepHygiene', 'stressManagement'];

  const handleGetTips = async () => {
    setIsLoading(true);
    setError(null);
    setTips([]);
    setExpandedTipIndex(null);
    try {
      const generatedTips = await generateHealthTips(language, selectedCategory, searchQuery);
      setTips(generatedTips);
      setTipsCategory(selectedCategory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleTip = (index: number) => {
    setExpandedTipIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const CategoryIcons: Record<TipCategory, React.ReactNode> = {
    fitness: <Dumbbell className="w-6 h-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />,
    mentalWellness: <Brain className="w-6 h-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />,
    sleepHygiene: <Moon className="w-6 h-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />,
    stressManagement: <Wind className="w-6 h-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />,
  };

  return (
    <section className="py-20 bg-green-50/50 dark:bg-gray-800/30 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <Sparkles className="w-12 h-12 text-green-500 dark:text-green-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 dark:text-green-200 mb-4">{t('healthAITitle')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{t('healthAIDescription')}</p>
          
          <div className="relative max-w-lg mx-auto mb-8">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                aria-label="Search for health tips"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
            {categories.map(category => (
                <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full transition-colors duration-300 ${selectedCategory === category ? 'bg-green-600 text-white shadow-md' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-600'}`}
                >
                    {t(category)}
                </button>
            ))}
          </div>

          <button
            onClick={handleGetTips}
            disabled={isLoading}
            className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-transform duration-300 transform hover:scale-105 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading ? t('generatingTips') : t('getHealthTipsButton')}
          </button>
        </div>

        {error && <p className="text-center text-red-500 dark:text-red-400 mt-8">{error}</p>}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            ))}
          {tips.map((tip, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-t-4 border-green-500 overflow-hidden transition-all duration-300">
              <button
                onClick={() => handleToggleTip(index)}
                className="w-full text-left p-6 flex justify-between items-start gap-4"
                aria-expanded={expandedTipIndex === index}
                aria-controls={`tip-details-${index}`}
              >
                {tipsCategory && CategoryIcons[tipsCategory]}
                <div className="flex-grow">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">{tip.summary}</p>
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">{tip.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{tip.explanation}</p>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0 transition-transform duration-300 ${expandedTipIndex === index ? 'rotate-180' : ''}`} />
              </button>
               <div
                id={`tip-details-${index}`}
                className={`transition-all duration-500 ease-in-out grid ${expandedTipIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                  <div className="overflow-hidden">
                      <div className="px-6 pb-6 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Instructions:</h4>
                          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{tip.details}</p>
                      </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HealthTipsSection;
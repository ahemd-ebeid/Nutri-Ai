import React from 'react';
import { useLanguage } from '../App';
import { MealPlanGoal } from '../types';
import { ArrowUpCircle, ArrowDownCircle, X } from './Icons';

interface MealPlanGoalModalProps {
  onSelect: (goal: MealPlanGoal) => void;
  onClose: () => void;
}

const MealPlanGoalModal: React.FC<MealPlanGoalModalProps> = ({ onSelect, onClose }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-gray-900/60 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center transform transition-all animate-fadeIn relative">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
        >
            <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">{t('selectGoalTitle')}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{t('selectGoalPrompt')}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onSelect('gain')}
            className="flex flex-col items-center justify-center gap-3 w-36 h-32 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 font-bold rounded-xl hover:bg-green-200 dark:hover:bg-green-800/80 transition-all duration-300 transform hover:scale-105"
          >
            <ArrowUpCircle className="w-10 h-10" />
            <span>{t('weightGain')}</span>
          </button>
          <button
            onClick={() => onSelect('loss')}
            className="flex flex-col items-center justify-center gap-3 w-36 h-32 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-bold rounded-xl hover:bg-blue-200 dark:hover:bg-blue-800/80 transition-all duration-300 transform hover:scale-105"
          >
            <ArrowDownCircle className="w-10 h-10" />
            <span>{t('weightLoss')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealPlanGoalModal;
import React, { useState } from 'react';
import { useLanguage } from '../App';
import type { MealPlan, MealPlanGoal } from '../types';
import { generateMealPlan } from '../services/geminiService';
import { Utensils } from './Icons';
import MealPlanGoalModal from './MealPlanGoalModal';

const MealCard: React.FC<{ title: string, time: string, description: string }> = ({ title, time, description }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-t-4 border-green-500 h-full">
        <div className="flex flex-col">
            <div className="flex justify-between items-baseline">
                <h3 className="text-xl font-bold text-green-800 dark:text-green-300">{title}</h3>
                <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">{time}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-3">{description}</p>
        </div>
    </div>
);


const MealPlannerSection: React.FC = () => {
    const { language, t } = useLanguage();
    const [plan, setPlan] = useState<MealPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

    const handleGetPlan = async (goal: MealPlanGoal) => {
        setIsLoading(true);
        setError(null);
        setPlan(null);
        try {
            const generatedPlan = await generateMealPlan(language, goal);
            setPlan(generatedPlan);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectGoal = (goal: MealPlanGoal) => {
        setIsGoalModalOpen(false);
        handleGetPlan(goal);
    }
    
    const mealImage = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop";

    return (
        <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
             {isGoalModalOpen && (
                <MealPlanGoalModal 
                    onSelect={handleSelectGoal} 
                    onClose={() => setIsGoalModalOpen(false)} 
                />
            )}
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="animate-fadeIn">
                        <img src={mealImage} alt="Healthy Meal" className="rounded-2xl shadow-2xl w-full h-auto object-cover" loading="lazy"/>
                    </div>
                    <div className="text-center md:text-left">
                        <Utensils className="w-12 h-12 text-green-500 dark:text-green-400 mx-auto md:mx-0 mb-4" />
                        <h2 className="text-3xl md:text-4xl font-bold text-green-900 dark:text-green-200 mb-4">{t('mealPlannerTitle')}</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">{t('mealPlannerDescription')}</p>
                        <button
                            onClick={() => setIsGoalModalOpen(true)}
                            disabled={isLoading}
                            className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-transform duration-300 transform hover:scale-105 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {isLoading ? t('generatingMealPlan') : t('getMealPlanButton')}
                        </button>
                    </div>
                </div>


                {error && <p className="text-center text-red-500 dark:text-red-400 mt-8">{error}</p>}

                <div className="mt-12">
                    {isLoading && (
                        <div className="grid md:grid-cols-3 gap-8">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-pulse">
                                    <div className="flex justify-between">
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                    </div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mt-2"></div>
                                </div>
                            ))}
                        </div>
                    )}
                    {plan && (
                         <div className="grid md:grid-cols-3 gap-8 animate-fadeIn">
                            <MealCard title={t('breakfast')} time={plan.breakfast.time} description={plan.breakfast.description} />
                            <MealCard title={t('lunch')} time={plan.lunch.time} description={plan.lunch.description} />
                            <MealCard title={t('dinner')} time={plan.dinner.time} description={plan.dinner.description} />
                         </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default MealPlannerSection;
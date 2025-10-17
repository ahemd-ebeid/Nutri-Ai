import React, { useState } from 'react';
import { useLanguage } from '../App';
import type { BMIResult } from '../types';
import { calculateBmi } from '../services/geminiService';
import { Scale } from './Icons';

const BMICalculatorSection: React.FC = () => {
    const { language, t } = useLanguage();
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [result, setResult] = useState<BMIResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const motivationalImage = "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1887&auto=format&fit=crop";


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!weight || !height) {
            setError('Please enter both weight and height.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const bmiResult = await calculateBmi(Number(weight), Number(height));
            setResult(bmiResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-20 bg-green-50/50 dark:bg-gray-800/30 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="lg:pr-12">
                         <div className="text-center lg:text-left max-w-3xl mx-auto">
                            <Scale className="w-12 h-12 text-green-500 dark:text-green-400 mx-auto lg:mx-0 mb-4" />
                            <h2 className="text-3xl md:text-4xl font-bold text-green-900 dark:text-green-200 mb-4">{t('bmiCalculatorTitle')}</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">{t('bmiCalculatorDescription')}</p>
                        </div>

                        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                <div>
                                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('weightLabel')}</label>
                                    <input
                                        id="weight"
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        placeholder="e.g., 70"
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('heightLabel')}</label>
                                    <input
                                        id="height"
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        placeholder="e.g., 175"
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                     <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-transform duration-300 transform hover:scale-105 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? t('calculating') : t('calculateButton')}
                                    </button>
                                </div>
                            </form>

                             {error && <p className="text-center text-red-500 dark:text-red-400 mt-6">{error}</p>}
                            
                            {isLoading && (
                                <div className="mt-8 text-center animate-pulse">
                                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mt-3"></div>
                                </div>
                            )}

                            {result && (
                                <div className="mt-8 p-6 bg-green-50 dark:bg-gray-900/50 rounded-lg text-center border-l-4 border-green-500 animate-fadeIn">
                                    <p className="text-lg text-gray-600 dark:text-gray-400">{t('yourBmiIs')}</p>
                                    <p className="text-5xl font-bold text-green-700 dark:text-green-300 my-2">{result.bmiValue.toFixed(1)}</p>
                                    <p className="text-lg text-gray-800 dark:text-gray-200 font-semibold">
                                        <span className="font-normal text-gray-600 dark:text-gray-400">{t('category')}: </span>
                                        {language === 'ar' ? result.category_ar : result.category_en}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                     <div className="hidden lg:block animate-fadeIn">
                        <img src={motivationalImage} alt="Fitness Motivation" className="rounded-2xl shadow-2xl w-full h-full object-cover max-h-[700px]" loading="lazy" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BMICalculatorSection;
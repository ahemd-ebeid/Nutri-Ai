import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { BotMessageSquare, Utensils, TrendingUp, Brain } from './Icons';

interface HeroSectionProps {
  onOpenChat: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; text: string; className: string; style: React.CSSProperties }> = ({ icon, text, className, style }) => (
    <div
        className={`absolute bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-3 rounded-xl shadow-lg flex items-center gap-3 ${className}`}
        style={{ animation: 'float 3s ease-in-out infinite', ...style }}
    >
        <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg">
            {icon}
        </div>
        <span className="font-semibold text-sm text-green-900 dark:text-green-200">{text}</span>
    </div>
);

const HeroSection: React.FC<HeroSectionProps> = ({ onOpenChat }) => {
  const { t } = useLanguage();
  const heroImage = "https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=2002&auto=format&fit=crop";
  
  const animatedKeywords = [
      t('animatedHeroKeyword1'), 
      t('animatedHeroKeyword2'), 
      t('animatedHeroKeyword3')
  ];
  const [keywordIndex, setKeywordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setKeywordIndex((prevIndex) => (prevIndex + 1) % animatedKeywords.length);
    }, 3000); // Change keyword every 3 seconds
    return () => clearInterval(interval);
  }, [animatedKeywords.length]);

  return (
    <section className="relative bg-green-50 dark:bg-gray-900/50 overflow-hidden">
      <div className="absolute top-0 -left-1/4 w-full h-full bg-gradient-to-br from-green-100/50 dark:from-green-900/30 to-transparent rounded-full transform -rotate-45 opacity-50 blur-3xl"></div>
      <div className="absolute bottom-0 -right-1/4 w-full h-full bg-gradient-to-tl from-yellow-100/30 dark:from-yellow-900/20 to-transparent rounded-full transform rotate-12 opacity-50 blur-3xl"></div>

      <div className="container mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center justify-between gap-12 z-10">
        <div className="md:w-1/2 text-center md:text-left z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-green-900 dark:text-green-200 leading-tight mb-4">
            {t('heroTitle')} for <br />
            <span className="relative inline-block text-green-600 dark:text-green-400 h-16 md:h-20">
                {animatedKeywords.map((word, index) => (
                    <span key={word} className={`absolute inset-0 transition-all duration-500 ease-in-out ${index === keywordIndex ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                        {word}
                    </span>
                ))}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
            {t('heroSubtitle')}
          </p>
          <button
            onClick={onOpenChat}
            className="inline-flex items-center gap-3 bg-green-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-green-700 transition-transform duration-300 transform hover:scale-105"
          >
            <BotMessageSquare className="w-6 h-6" />
            <span>{t('heroCta')}</span>
          </button>
        </div>
        
        <div className="md:w-1/2 flex justify-center z-10">
           <div className="relative w-full max-w-md">
             <img 
                src={heroImage}
                alt="Healthy Lifestyle"
                className="rounded-3xl shadow-2xl w-full h-auto object-cover"
             />
              <FeatureCard 
                icon={<Utensils className="w-6 h-6 text-green-600 dark:text-green-400" />} 
                text={t('featureCard1')}
                className="top-8 -left-8"
                style={{ animationDelay: '0s' }}
              />
               <FeatureCard 
                icon={<Brain className="w-6 h-6 text-green-600 dark:text-green-400" />} 
                text={t('featureCard2')}
                className="top-1/2 -right-12"
                style={{ animationDelay: '1s' }}
              />
               <FeatureCard 
                icon={<TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />} 
                text={t('featureCard3')}
                className="-bottom-8 left-1/4"
                style={{ animationDelay: '2s' }}
              />
           </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

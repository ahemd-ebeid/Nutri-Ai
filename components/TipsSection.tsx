import React from 'react';
import { useLanguage } from '../App';

const TipCard: React.FC<{ imgSrc: string; title: string; text: string; alt: string }> = ({ imgSrc, title, text, alt }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
        <img src={imgSrc} alt={alt} className="w-full h-48 object-cover" loading="lazy" />
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-3">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 flex-grow">{text}</p>
        </div>
    </div>
);

const TipsSection: React.FC = () => {
  const { t } = useLanguage();

  const tips = [
    {
      imgSrc: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop',
      alt: 'A healthy bowl of salad',
      title: t('nutritionTipTitle'),
      text: t('nutritionTipText'),
    },
    {
      imgSrc: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=1887&auto=format&fit=crop',
      alt: 'A glass of water with lemon slices',
      title: t('hydrationTipTitle'),
      text: t('hydrationTipText'),
    },
    {
      imgSrc: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?q=80&w=2070&auto=format&fit=crop',
      alt: 'Person sleeping peacefully',
      title: t('sleepTipTitle'),
      text: t('sleepTipText'),
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-green-900 dark:text-green-200 mb-12">{t('dailyTipsTitle')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {tips.map((tip, index) => (
            <TipCard key={index} {...tip} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TipsSection;
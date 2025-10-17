import React from 'react';
import { useLanguage } from '../App';
import { Linkedin } from './Icons';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-green-900 dark:bg-gray-950 text-white py-8 transition-colors duration-300">
      <div className="container mx-auto px-6 text-center">
        <p className="mb-4 text-gray-300 dark:text-gray-400">{t('footerText')}</p>
        <a
          href="https://www.linkedin.com/in/ahmed--ebeid"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-green-200 hover:text-white transition-colors duration-300"
        >
          <Linkedin className="w-5 h-5" />
          <span>{t('contact')}</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { useLanguage, useTheme, useAuth } from '../App';
import { Leaf, Sun, Moon as MoonIcon, LogOut, User } from './Icons'; // Renamed Moon to avoid conflict

interface HeaderProps {
    onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Leaf className="w-8 h-8 text-green-600" />
          <h1 className="text-xl md:text-2xl font-bold text-green-800 dark:text-green-300">{t('appName')}</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
           <div className="relative group">
              <button
                onClick={toggleTheme}
                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                aria-label={theme === 'light' ? t('toggleThemeDark') : t('toggleThemeLight')}
              >
                {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {theme === 'light' ? t('toggleThemeDark') : t('toggleThemeLight')}
              </span>
           </div>
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 font-semibold rounded-lg hover:bg-green-200 dark:hover:bg-green-800/60 transition-colors duration-300"
          >
            {t('languageName')}
          </button>
           {currentUser ? (
              <div className="flex items-center gap-2">
                  <span className="hidden md:inline text-gray-700 dark:text-gray-300 font-medium">
                    {t('welcome')}, {currentUser.username}!
                  </span>
                  <button onClick={logout} className="p-2 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors duration-300">
                      <LogOut className="w-5 h-5" />
                  </button>
              </div>
            ) : (
              <button
                  onClick={onLoginClick}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300"
              >
                  <User className="w-5 h-5" />
                  <span>{t('login')}</span>
              </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
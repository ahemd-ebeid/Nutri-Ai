import React, { useState } from 'react';
import { useLanguage, useAuth } from '../App';
import { authService } from '../services/authService';
import { X, User, Leaf } from './Icons';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let user;
      if (isLoginView) {
        user = authService.login(username, password);
        if (!user) throw new Error("Invalid username or password.");
      } else {
        user = authService.signup(username, password);
         if (!user) throw new Error("Could not create account.");
      }
      login(user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center transform transition-all animate-fadeIn relative">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
        >
            <X className="w-6 h-6" />
        </button>
        <div className="flex justify-center items-center gap-2 mb-4">
             <Leaf className="w-10 h-10 text-green-600" />
             <h2 className="text-2xl font-bold text-green-800 dark:text-green-300">{isLoginView ? t('loginToAccount') : t('createAccount')}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="username" className="sr-only">{t('username')}</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('username')}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                    required
                />
            </div>
             <div>
                <label htmlFor="password">{t('password')}</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('password')}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                    required
                />
            </div>

            {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-transform duration-300 transform hover:scale-105 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {isLoading ? '...' : (isLoginView ? t('login') : t('signup'))}
            </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            {isLoginView ? t('loginPrompt') : t('signupPrompt')}{' '}
            <button onClick={() => { setIsLoginView(!isLoginView); setError(null); }} className="font-semibold text-green-600 hover:text-green-500">
                 {isLoginView ? t('signup') : t('login')}
            </button>
        </p>

      </div>
    </div>
  );
};

export default AuthModal;
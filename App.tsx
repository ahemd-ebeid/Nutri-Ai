// Implemented the main App component to provide structure and context to the application.
import React, { useState, createContext, useContext, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TipsSection from './components/TipsSection';
import FitnessAISection from './components/FitnessAISection';
import BMICalculatorSection from './components/BMICalculatorSection';
import MealPlannerSection from './components/MealPlannerSection';
import HealthTasksSection from './components/HealthTasksSection';
import GallerySection from './components/GallerySection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import Chatbot from './components/ChatbotSection';
import AuthModal from './components/AuthModal';
import { BotMessageSquare } from './components/Icons';

import type { Language, Theme, User } from './types';
import { translations } from './constants/localization';
import { authService } from './services/authService';


// --- Language Context ---
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};

// --- Theme Context ---
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

// --- Auth Context ---
interface AuthContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}


const App: React.FC = () => {
    const [language, setLanguageState] = useState<Language>('en');
    const [theme, setTheme] = useState<Theme>('light');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // --- Draggable FAB Logic ---
    const fabRef = useRef<HTMLButtonElement>(null);
    const [fabPosition, setFabPosition] = useState({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);
    const dragStartPosRef = useRef({ x: 0, y: 0 });
    const fabStartPosRef = useRef({ x: 0, y: 0 });
    const hasDraggedRef = useRef(false);

    const handleFabClick = () => {
        if (!hasDraggedRef.current) {
            setIsChatOpen(true);
        }
    };

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        isDraggingRef.current = true;
        // Reset drag flag on new drag start
        setTimeout(() => { hasDraggedRef.current = false; }, 0);

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        dragStartPosRef.current = { x: clientX, y: clientY };
        fabStartPosRef.current = { ...fabPosition };

        window.addEventListener('mousemove', handleDragMove);
        window.addEventListener('touchmove', handleDragMove, { passive: false });
        window.addEventListener('mouseup', handleDragEnd);
        window.addEventListener('touchend', handleDragEnd);
    };

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
        if (!isDraggingRef.current) return;
        
        if (e.type === 'touchmove') {
            e.preventDefault();
        }

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - dragStartPosRef.current.x;
        const deltaY = clientY - dragStartPosRef.current.y;
        
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            hasDraggedRef.current = true;
        }

        setFabPosition({ 
            x: fabStartPosRef.current.x + deltaX, 
            y: fabStartPosRef.current.y + deltaY 
        });
    };

    const handleDragEnd = () => {
        isDraggingRef.current = false;
        
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchend', handleDragEnd);
    };
    // --- End Draggable FAB Logic ---


    useEffect(() => {
        const loggedInUser = authService.getCurrentUser();
        if(loggedInUser) {
            setCurrentUser(loggedInUser);
        }
    }, []);

    const login = (user: User) => {
        setCurrentUser(user);
        authService.setCurrentUser(user);
    }

    const logout = () => {
        setCurrentUser(null);
        authService.clearCurrentUser();
    }


    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);
    
    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };
    
    const t = (key: keyof typeof translations.en): string => {
        return translations[language][key] || translations.en[key];
    };

    const languageContextValue = useMemo(() => ({ language, setLanguage, t }), [language]);
    const themeContextValue = useMemo(() => ({ theme, toggleTheme }), [theme]);
    const authContextValue = useMemo(() => ({ currentUser, login, logout }), [currentUser]);


  return (
    <LanguageContext.Provider value={languageContextValue}>
      <ThemeContext.Provider value={themeContextValue}>
        <AuthContext.Provider value={authContextValue}>
            <div className={`font-sans bg-gray-50 dark:bg-gray-950 transition-colors duration-300 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
                <Header onLoginClick={() => setIsAuthModalOpen(true)} />
                <main>
                    <HeroSection onOpenChat={() => setIsChatOpen(true)} />
                    <TipsSection />
                    <FitnessAISection />
                    <BMICalculatorSection />
                    <MealPlannerSection />
                    <HealthTasksSection />
                    <GallerySection />
                    <TestimonialsSection />
                </main>
                <Footer />
                <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                 {!isChatOpen && (
                    <button
                        ref={fabRef}
                        onClick={handleFabClick}
                        onMouseDown={handleDragStart}
                        onTouchStart={handleDragStart}
                        style={{ transform: `translate(${fabPosition.x}px, ${fabPosition.y}px)` }}
                        className={`fixed bottom-6 ${language === 'ar' ? 'left-6' : 'right-6'} z-40 bg-green-600 text-white w-20 h-20 p-4 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-700 transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-offset-2 animate-pulse-shadow cursor-grab active:cursor-grabbing`}
                        aria-label="Open chat assistant"
                    >
                        <BotMessageSquare className="w-10 h-10" />
                    </button>
                )}
                {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
            </div>
        </AuthContext.Provider>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
};

export default App;
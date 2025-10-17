

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import type { ChatMessage } from '../types';
import { startChatSession } from '../services/geminiService';
import { Bot, Send, User, X } from './Icons';
import type { Chat } from '@google/genai';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  
  useEffect(() => {
    if (isOpen && !chat) {
        setChat(startChatSession());
    }
  }, [isOpen, chat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chat) return;

    const newUserMessage: ChatMessage = { sender: 'user', text: userInput };
    setMessages((prev) => [...prev, newUserMessage]);
    const currentInput = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: currentInput });
      const newAiMessage: ChatMessage = { sender: 'ai', text: response.text };
      setMessages((prev) => [...prev, newAiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        sender: 'ai',
        text: error instanceof Error ? error.message : "An unexpected error occurred.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-0 ${language === 'ar' ? 'md:left-6 left-0' : 'md:right-6 right-0'} md:bottom-24 w-full md:w-[400px] h-[70vh] md:h-[600px] z-50 transition-all duration-500 ease-out ${isOpen ? 'transform translate-y-0 scale-100 opacity-100' : 'transform translate-y-full scale-95 opacity-0 pointer-events-none'}`}>
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl md:rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col h-full">
        <header className="flex justify-between items-center p-4 bg-green-600 text-white rounded-t-lg md:rounded-t-2xl flex-shrink-0">
            <h3 className="font-bold text-lg">{t('chatbotTitle')}</h3>
            <button onClick={onClose} aria-label="Close chat" className="p-1 rounded-full hover:bg-green-700 transition-colors">
                <X className="w-6 h-6" />
            </button>
        </header>
        <div ref={chatContainerRef} className="message-container flex-1 p-4 md:p-6 space-y-5 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 message-item ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'ai' && (
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                )}
                <div
                  className={`max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-green-600 text-white rounded-br-none ltr:rounded-br-none rtl:rounded-bl-none'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-bl-none ltr:rounded-bl-none rtl:rounded-br-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                 {msg.sender === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))}
             {isLoading && (
                <div className="flex items-start gap-3 message-item">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="max-w-md px-4 py-3 rounded-2xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
            )}
          </div>
        <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={t('chatbotPlaceholder')}
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed transition"
            >
              <Send className="w-6 h-6" />
            </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
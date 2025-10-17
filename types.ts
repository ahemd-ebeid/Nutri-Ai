// Fix: Replaced component logic with actual type definitions.
export type Language = 'en' | 'ar';

export type Theme = 'light' | 'dark';

export interface User {
  id: number;
  username: string;
  passwordHash: string;
}

export interface HealthTip {
  summary: string;
  title: string;
  explanation: string;
  details: string;
}

export type TipCategory = 'fitness' | 'mentalWellness' | 'sleepHygiene' | 'stressManagement';

export interface BMIResult {
  bmiValue: number;
  category_en: string;
  category_ar: string;
}

export type MealPlanGoal = 'gain' | 'loss';

export interface Meal {
  name: string;
  time: string;
  description: string;
}

export interface MealPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface Testimonial {
    id: number;
    userId: number;
    username: string;
    quote: string;
    rating: number;
    avatar: string;
}

export type Priority = 'high' | 'medium' | 'low';

export interface Task {
    id: number;
    text: string;
    completed: boolean;
    priority: Priority;
    userId: number;
    dueDate?: string;
    reminderTime?: string;
}

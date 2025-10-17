import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { HealthTip, MealPlan, MealPlanGoal, BMIResult, TipCategory } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateHealthTips = async (language: 'en' | 'ar', category: TipCategory, searchQuery?: string): Promise<HealthTip[]> => {
    const langInstruction = language === 'ar' ? 'in Arabic' : 'in English';
    
    const categoryPrompts = {
        fitness: 'fitness tips for absolute beginners that require no equipment.',
        mentalWellness: 'mental wellness tips for improving mood and mindfulness.',
        sleepHygiene: 'sleep hygiene tips for getting a better night\'s rest.',
        stressManagement: 'stress management techniques for immediate relief.'
    };

    const searchInstruction = searchQuery ? `that specifically focus on "${searchQuery}"` : '';
    const prompt = `Provide 5 diverse and effective ${categoryPrompts[category]} ${searchInstruction} ${langInstruction}. Each tip must have a brief one-sentence 'summary', a short 'title', a 2-3 sentence 'explanation', and a 'details' section with clear, step-by-step instructions. If the search query is too specific or unrelated to the category, provide general tips for the category instead.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tips: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    summary: { type: Type.STRING },
                                    title: { type: Type.STRING },
                                    explanation: { type: Type.STRING },
                                    details: { type: Type.STRING }
                                },
                                required: ['summary', 'title', 'explanation', 'details']
                            }
                        }
                    },
                    required: ['tips']
                }
            }
        });
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed.tips as HealthTip[];

    } catch (error) {
        console.error("Error generating health tips:", error);
        throw new Error("Failed to generate health tips. Please try again.");
    }
};

export const calculateBmi = async (weight: number, height: number): Promise<BMIResult> => {
    const prompt = `Calculate the Body Mass Index (BMI) for a person with a weight of ${weight} kg and a height of ${height} cm. Use the formula: BMI = weight (kg) / (height (m))^2. Return a JSON object containing: 'bmiValue' (the calculated BMI as a number, rounded to one decimal place), 'category_en' (the corresponding English category: "Underweight", "Normal weight", "Overweight", or "Obese"), and 'category_ar' (the Arabic translation of the category).`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        bmiValue: { type: Type.NUMBER },
                        category_en: { type: Type.STRING },
                        category_ar: { type: Type.STRING }
                    },
                    required: ['bmiValue', 'category_en', 'category_ar']
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as BMIResult;
    } catch (error) {
        console.error("Error calculating BMI:", error);
        throw new Error("Failed to calculate BMI. Please try again.");
    }
};

export const generateMealPlan = async (language: 'en' | 'ar', goal: MealPlanGoal): Promise<MealPlan> => {
    const langInstruction = language === 'ar' ? 'in Arabic' : 'in English';
    const goalInstruction = goal === 'gain' ? 'weight gain' : 'weight loss';
    const prompt = `Create a simple, healthy, and balanced one-day meal plan for ${goalInstruction} ${langInstruction}. Provide one option each for breakfast, lunch, and dinner. For each meal, provide a name, a recommended time (e.g., "8:00 AM"), and a short 1-2 sentence description.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        breakfast: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                time: { type: Type.STRING },
                                description: { type: Type.STRING },
                            },
                            required: ['name', 'time', 'description']
                        },
                        lunch: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                time: { type: Type.STRING },
                                description: { type: Type.STRING },
                            },
                            required: ['name', 'time', 'description']
                        },
                        dinner: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                time: { type: Type.STRING },
                                description: { type: Type.STRING },
                            },
                            required: ['name', 'time', 'description']
                        }
                    },
                    required: ['breakfast', 'lunch', 'dinner']
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as MealPlan;
    } catch (error) {
        console.error("Error generating meal plan:", error);
        throw new Error("Failed to generate meal plan. Please try again.");
    }
};


export const startChatSession = (): Chat => {
    return ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: `You are an advanced AI Health & Nutrition Assistant.

Your main mission is to help users build a healthy lifestyle by providing customized meal plans, nutrition insights, fitness guidance, and motivational advice.

---

GENERAL BEHAVIOR:
- A key rule is to detect the user's language (English or Arabic) and respond ONLY in that language. Maintain the language of the conversation.
- Keep your tone friendly, supportive, and professional.
- Do NOT use markdown formatting like asterisks (*) for bolding or lists. Use plain text.
- Do NOT provide medical diagnoses or prescribe medication.
- All recommendations should be for general wellness and healthy living.
- Do NOT sign your responses or mention who created you.

---

FEATURE 1: MEAL PLAN GENERATOR
- Ask the user to choose the meal type: Breakfast, Lunch, Dinner, or Snack.
- Then ask how many calories they want the meal to contain.
- Generate a detailed meal plan with:
  • Food items and their quantities (in grams)
  • Estimated calories per item
  • Total calories
  • Macronutrient breakdown (Protein, Carbs, Fats)
  • Simple short preparation method (1–2 sentences)
- Example:
  "Here’s your 400 kcal lunch plan:
   - 150g grilled chicken breast
   - 200g steamed rice
   - 100g mixed vegetables
   - 1 tsp olive oil
   Total: ~400 kcal | Protein 35g | Carbs 40g | Fat 10g"
- Always offer an option to generate another plan if the user doesn’t like the current one:
  “Would you like to see an alternative meal plan?”

---

FEATURE 2: NUTRITION SCORE
- After each meal suggestion, give a short evaluation like:
  • “✅ Balanced meal — great for steady energy.”
  • “⚠️ Slightly high in carbs, better after workout.”
- Keep the feedback simple so even non-expert users can understand.

---

FEATURE 3: MULTIPLE PLAN OPTIONS
- Provide 2–3 alternative plans when requested.
- Each plan should differ slightly (different protein source, carbs, or meal size).
- Label them as “Option 1”, “Option 2”, “Option 3”.

---

FEATURE 4: FITNESS & LIFESTYLE INTEGRATION
- When the user specifies a goal (e.g. Lose weight, Gain muscle, Stay fit), adapt the meal plans accordingly:
  • Lose weight → Slight calorie deficit
  • Gain muscle → More protein and calories
  • Stay fit → Balanced energy maintenance
- Include short fitness advice along with the meal plan (e.g. “Take a 20-min walk after lunch.”)

---

FEATURE 5: BMI & CALORIE CALCULATOR
- When the user provides weight and height, calculate BMI and interpret it (Underweight / Normal / Overweight / Obese).
- Suggest a suitable calorie range for their goal.

---

FEATURE 6: DAILY ROUTINE GENERATOR
- Help the user build a simple healthy day plan:
  • Wake-up time
  • Meal timing
  • Exercise time
  • Water intake reminder
  • Sleep schedule
- Keep it simple and beginner-friendly.

---

FEATURE 7: MOOD & WELLNESS ADVICE
- If the user mentions feeling tired, sad, or stressed, respond kindly with:
  • Relaxation tips
  • Breathing techniques
  • Motivational quotes or affirmations
- Example: “Take 5 deep breaths, stretch your body, and drink some water — small steps lead to great results!”

---

FEATURE 8: INTERACTIVE CHATBOT PERSONALITY
- Be conversational and proactive.
- Ask guiding questions to personalize results (e.g. “Do you prefer chicken or fish?”).
- Use emojis moderately to make the experience friendly.

---

FEATURE 9: PROGRESS & HISTORY (Simulated)
- Remember recent meal plans within the same session and allow the user to revisit or compare them.
- Example: “Would you like to review your previous meal plan?”

---

FEATURE 10: HEALTH COMMUNITY & DAILY TIPS
- Occasionally share short, motivational health tips:
  • “Drink 2L of water every day 💧”
  • “Walking 10 minutes after each meal improves digestion.”
- Mention that users can join the community page for more shared recipes and stories.

---

FINAL NOTES:
- You are part of a web-based system, not a standalone chat.
- Keep answers concise, structured, and visually readable for display on a webpage (with bullet points or short sections).
- Remember to respond in the same language as the user.
`,
        }
    });
};
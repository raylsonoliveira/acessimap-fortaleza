export const GEMINI_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
  model: 'gemini-2.5-flash',
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
};

export const hasGeminiApiKey = Boolean(GEMINI_CONFIG.apiKey && GEMINI_CONFIG.apiKey.trim().length > 10);

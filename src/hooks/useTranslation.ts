import { useState } from 'react';
import Constants from 'expo-constants';

// Get API key from Expo Constants
const API_KEY = Constants.expoConfig?.extra?.googleTranslateApiKey;

if (!API_KEY) {
  console.error('Missing Google Translate API key in app config');
}

export function useTranslation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = async (text: string, targetLang: string, sourceLang: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!API_KEY) {
        throw new Error('Google Translate API key is not configured');
      }

      console.log('Using API Key:', API_KEY.substring(0, 5) + '...');

      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            target: targetLang,
            source: sourceLang,
          }),
        }
      );

      const data = await response.json();
      console.log('Translation Response:', data);

      if (!response.ok) {
        throw new Error(data.error?.message || 'Translation failed');
      }

      return data.data.translations[0].translatedText;
    } catch (err: any) {
      console.error('Translation Error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    translate,
    loading,
    error,
  };
} 
import Constants from 'expo-constants';

const GOOGLE_TRANSLATE_API_KEY = Constants.expoConfig?.extra?.googleTranslateApiKey || '';
const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

type TranslationResponse = {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
};

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang?: string
): Promise<string> {
  try {
    const params = new URLSearchParams({
      q: text,
      target: targetLang,
      key: GOOGLE_TRANSLATE_API_KEY,
      ...(sourceLang && { source: sourceLang }),
    });

    const response = await fetch(`${GOOGLE_TRANSLATE_API_URL}?${params}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Translation failed');
    }

    const data: TranslationResponse = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
} 
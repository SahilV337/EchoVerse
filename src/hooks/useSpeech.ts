import { useState } from 'react';
import * as Speech from 'expo-speech';

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const speak = async (text: string, language: string) => {
    try {
      setError(null);
      setSpeaking(true);
      
      await Speech.speak(text, {
        language,
        onDone: () => setSpeaking(false),
        onError: (error) => {
          setError(error.message);
          setSpeaking(false);
        },
      });
    } catch (err: any) {
      setError(err.message);
      setSpeaking(false);
    }
  };

  const stop = async () => {
    try {
      await Speech.stop();
      setSpeaking(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    speak,
    stop,
    speaking,
    error,
  };
} 
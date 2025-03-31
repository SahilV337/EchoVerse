import { useState, useEffect, useCallback } from 'react';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import { PermissionsAndroid, Platform } from 'react-native';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    function onSpeechResults(e: SpeechResultsEvent) {
      setResults(e.value ?? []);
    }
    function onSpeechStart() {
      setIsListening(true);
      setError(null);
    }
    function onSpeechEnd() {
      setIsListening(false);
    }
    function onSpeechError(e: SpeechErrorEvent) {
      setError(e.error?.message || 'Speech recognition failed');
      setIsListening(false);
    }

    // Add event listeners
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      // Remove event listeners
      Voice.destroy().then(() => {
        Voice.removeAllListeners();
      });
    };
  }, []);

  const requestPermissions = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone to record speech.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Error requesting permissions:', err);
        return false;
      }
    }
    return true;
  }, []);

  const startListening = useCallback(async (language: string) => {
    try {
      setError(null);
      setResults([]);
      
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        throw new Error('Microphone permission not granted');
      }

      // Make sure Voice is stopped before starting
      await Voice.stop();
      await Voice.destroy();
      
      // Initialize and start
      await Voice.initialize();
      await Voice.start(language);
      
      return new Promise<string>((resolve, reject) => {
        const timeout = setTimeout(() => {
          Voice.stop();
          if (results.length > 0) {
            resolve(results[0]);
          } else {
            reject(new Error('No speech detected'));
          }
        }, 5000); // 5 second timeout

        Voice.onSpeechResults = (e: SpeechResultsEvent) => {
          if (e.value && e.value[0]) {
            clearTimeout(timeout);
            Voice.stop();
            resolve(e.value[0]);
          }
        };

        Voice.onSpeechError = (e: SpeechErrorEvent) => {
          clearTimeout(timeout);
          reject(new Error(e.error?.message || 'Speech recognition failed'));
        };
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [results, requestPermissions]);

  const stopListening = useCallback(async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  return {
    startListening,
    stopListening,
    isListening,
    error,
    results,
  };
} 
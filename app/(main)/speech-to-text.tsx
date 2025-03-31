import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Surface, Text, IconButton, Snackbar } from 'react-native-paper';
import LanguageSelector from '../../src/components/translation/LanguageSelector';
import { useSpeechRecognition } from '../../src/hooks/useSpeechRecognition';
import { useTranslation } from '../../src/hooks/useTranslation';

export default function SpeechToText() {
  const [recognizedText, setRecognizedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('hi');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { startListening, stopListening, isListening, error: speechError } = useSpeechRecognition();
  const { translate, loading: translating, error: translateError } = useTranslation();

  const handleStartListening = async () => {
    try {
      setError(null);
      const text = await startListening(sourceLanguage);
      if (text) {
        setRecognizedText(text);
        handleTranslate(text);
      }
    } catch (error: any) {
      setError(error.message || speechError);
      setSnackbarVisible(true);
    }
  };

  const handleTranslate = async (text: string) => {
    try {
      const result = await translate(text, targetLanguage, sourceLanguage);
      setTranslatedText(result);
    } catch (error) {
      setError(translateError);
      setSnackbarVisible(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface} elevation={1}>
        <View style={styles.languageSelectors}>
          <LanguageSelector
            selectedLanguage={sourceLanguage}
            onSelect={setSourceLanguage}
            label="Speak in"
          />
          <LanguageSelector
            selectedLanguage={targetLanguage}
            onSelect={setTargetLanguage}
            label="Translate to"
          />
        </View>

        <View style={styles.recordButton}>
          <IconButton
            icon={isListening ? 'stop' : 'microphone'}
            mode="contained"
            size={40}
            onPress={isListening ? stopListening : handleStartListening}
            loading={translating}
          />
          <Text style={styles.recordingStatus}>
            {isListening ? 'Listening...' : 'Tap to speak'}
          </Text>
        </View>

        {recognizedText && (
          <Surface style={styles.resultContainer} elevation={1}>
            <Text variant="titleSmall" style={styles.resultLabel}>
              Recognized Speech
            </Text>
            <Text style={styles.recognizedText}>{recognizedText}</Text>
          </Surface>
        )}

        {translatedText && (
          <Surface style={styles.resultContainer} elevation={1}>
            <Text variant="titleSmall" style={styles.resultLabel}>
              Translation
            </Text>
            <Text style={styles.translatedText}>{translatedText}</Text>
          </Surface>
        )}
      </Surface>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        action={{
          label: 'Close',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {error || 'An error occurred. Please try again.'}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  surface: {
    padding: 16,
    borderRadius: 10,
  },
  languageSelectors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 24,
  },
  recordButton: {
    alignItems: 'center',
    marginVertical: 24,
  },
  recordingStatus: {
    marginTop: 8,
    color: '#666',
  },
  resultContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginTop: 16,
  },
  resultLabel: {
    color: '#666',
    marginBottom: 8,
  },
  recognizedText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  translatedText: {
    fontSize: 16,
    lineHeight: 24,
  },
}); 
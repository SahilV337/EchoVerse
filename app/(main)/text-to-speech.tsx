import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Surface, Text, Snackbar, IconButton } from 'react-native-paper';
import LanguageSelector from '../../src/components/translation/LanguageSelector';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useSpeech } from '../../src/hooks/useSpeech';

export default function TextToSpeech() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('hi'); // Default to Hindi
  const { translate, loading: translating, error: translateError } = useTranslation();
  const { speak, stop, speaking, error: speechError } = useSpeech();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    try {
      const result = await translate(sourceText, targetLanguage, sourceLanguage);
      setTranslatedText(result);
    } catch (error) {
      setError(translateError);
      setSnackbarVisible(true);
    }
  };

  const handleSpeak = async () => {
    if (speaking) {
      await stop();
    } else {
      try {
        await speak(translatedText, targetLanguage);
      } catch (error) {
        setError(speechError || 'Failed to play speech');
        setSnackbarVisible(true);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface} elevation={1}>
        <View style={styles.languageSelectors}>
          <LanguageSelector
            selectedLanguage={sourceLanguage}
            onSelect={setSourceLanguage}
            label="From"
          />
          <LanguageSelector
            selectedLanguage={targetLanguage}
            onSelect={setTargetLanguage}
            label="To"
          />
        </View>

        <TextInput
          mode="outlined"
          multiline
          numberOfLines={4}
          placeholder="Enter text to translate and speak"
          value={sourceText}
          onChangeText={setSourceText}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleTranslate}
          loading={translating}
          disabled={!sourceText.trim()}
          style={styles.button}
        >
          Translate
        </Button>

        {translatedText ? (
          <Surface style={styles.resultContainer} elevation={1}>
            <View style={styles.resultHeader}>
              <Text variant="titleSmall" style={styles.resultLabel}>
                Translation
              </Text>
              <IconButton
                icon={speaking ? 'stop' : 'play'}
                mode="contained-tonal"
                onPress={handleSpeak}
                disabled={translating}
              />
            </View>
            <Text style={styles.translatedText}>
              {translatedText}
            </Text>
          </Surface>
        ) : null}
      </Surface>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
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
    flex: 1,
  },
  languageSelectors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  input: {
    marginVertical: 16,
  },
  button: {
    marginBottom: 16,
  },
  resultContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultLabel: {
    color: '#666',
  },
  translatedText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
import { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Surface, Text, Snackbar, IconButton, ProgressBar } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import LanguageSelector from '../../src/components/translation/LanguageSelector';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useSpeech } from '../../src/hooks/useSpeech';

const MAX_CHARS = 5000; // Google Translate API limit

export default function TextToText() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('hi');
  const { translate, loading, error: translateError } = useTranslation();
  const { speak, stop, speaking, error: speechError } = useSpeech();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const charCount = useMemo(() => sourceText.length, [sourceText]);
  const progress = useMemo(() => charCount / MAX_CHARS, [charCount]);
  const isOverLimit = charCount > MAX_CHARS;

  const handleTranslate = async () => {
    try {
      console.log('Starting translation...');
      const result = await translate(sourceText, targetLanguage, sourceLanguage);
      console.log('Translation successful:', result);
      setTranslatedText(result);
    } catch (error) {
      console.error('Translation error:', error);
      setError(translateError);
      setSnackbarVisible(true);
    }
  };

  const handleSpeak = async (text: string, language: string) => {
    try {
      if (speaking) {
        await stop();
      } else {
        await speak(text, language);
      }
    } catch (error) {
      setError(speechError || 'Failed to play speech');
      setSnackbarVisible(true);
    }
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    if (translatedText) {
      setSourceText(translatedText);
      setTranslatedText('');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setError('Text copied to clipboard');
      setSnackbarVisible(true);
    } catch (err: any) {
      setError('Failed to copy text');
      setSnackbarVisible(true);
    }
  };

  const handleTextChange = (text: string) => {
    if (text.length <= MAX_CHARS) {
      setSourceText(text);
    } else {
      setSourceText(text.slice(0, MAX_CHARS));
      setError('Character limit reached');
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
            label="From"
          />
          <IconButton
            icon="swap-horizontal"
            mode="contained-tonal"
            onPress={handleSwapLanguages}
            style={styles.swapButton}
          />
          <LanguageSelector
            selectedLanguage={targetLanguage}
            onSelect={setTargetLanguage}
            label="To"
          />
        </View>

        <Surface style={styles.textContainer} elevation={1}>
          <View style={styles.inputContainer}>
            <TextInput
              mode="flat"
              multiline
              numberOfLines={4}
              placeholder="Enter text to translate"
              value={sourceText}
              onChangeText={handleTextChange}
              style={styles.input}
              error={isOverLimit}
            />
            <View style={styles.charCounter}>
              <Text 
                variant="labelSmall" 
                style={[
                  styles.charCountText,
                  isOverLimit && styles.errorText
                ]}
              >
                {charCount}/{MAX_CHARS}
              </Text>
              <ProgressBar 
                progress={progress} 
                color={isOverLimit ? '#B00020' : '#006494'} 
                style={styles.progressBar}
              />
            </View>
          </View>
          <View style={styles.actionButtons}>
            <IconButton
              icon="content-copy"
              size={20}
              onPress={() => copyToClipboard(sourceText)}
              disabled={!sourceText}
            />
            <IconButton
              icon={speaking ? 'stop' : 'play'}
              size={20}
              onPress={() => handleSpeak(sourceText, sourceLanguage)}
              disabled={!sourceText}
            />
          </View>
        </Surface>

        <Button
          mode="contained"
          onPress={handleTranslate}
          loading={loading}
          disabled={!sourceText.trim() || isOverLimit}
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
              <View style={styles.actionButtons}>
                <IconButton
                  icon="content-copy"
                  size={20}
                  onPress={() => copyToClipboard(translatedText)}
                />
                <IconButton
                  icon={speaking ? 'stop' : 'play'}
                  size={20}
                  onPress={() => handleSpeak(translatedText, targetLanguage)}
                />
              </View>
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
    flex: 1,
  },
  languageSelectors: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
  },
  swapButton: {
    marginBottom: 8,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 16,
    padding: 4,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
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
  charCounter: {
    marginTop: 4,
    paddingHorizontal: 4,
  },
  charCountText: {
    textAlign: 'right',
    color: '#666',
    marginBottom: 2,
  },
  errorText: {
    color: '#B00020',
  },
  progressBar: {
    height: 2,
    borderRadius: 1,
  },
}); 
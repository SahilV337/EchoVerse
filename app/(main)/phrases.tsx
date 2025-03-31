import { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Surface, Text, Chip, List, IconButton, Snackbar } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { PHRASES, PHRASE_CATEGORIES } from '../../src/constants/phrases';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useSpeech } from '../../src/hooks/useSpeech';
import { useFavorites } from '../../src/hooks/useFavorites';
import LanguageSelector from '../../src/components/translation/LanguageSelector';

type TranslatedPhrase = {
  original: string;
  translated: string;
};

export default function Phrases() {
  const [selectedCategory, setSelectedCategory] = useState(PHRASE_CATEGORIES.COMMON);
  const [selectedPhrase, setSelectedPhrase] = useState('');
  const [translatedPhrase, setTranslatedPhrase] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('hi');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { translate, loading, error: translateError } = useTranslation();
  const { speak, stop, speaking } = useSpeech();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const handleTranslate = async (text: string) => {
    try {
      setSelectedPhrase(text);
      const result = await translate(text, targetLanguage, sourceLanguage);
      setTranslatedPhrase(result);
    } catch (error) {
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
      setError('Failed to play speech');
      setSnackbarVisible(true);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setError('Text copied to clipboard');
      setSnackbarVisible(true);
    } catch (err) {
      setError('Failed to copy text');
      setSnackbarVisible(true);
    }
  };

  const handleFavorite = useCallback((phrase: TranslatedPhrase) => {
    toggleFavorite(phrase);
  }, [toggleFavorite]);

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface} elevation={1}>
        {/* Language Selectors */}
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

        {/* Category Selection */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {Object.values(PHRASE_CATEGORIES).map((category) => (
            <Chip
              key={category}
              selected={category === selectedCategory}
              onPress={() => setSelectedCategory(category)}
              style={styles.chip}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Chip>
          ))}
        </ScrollView>

        {/* Phrases List */}
        <List.Section>
          {PHRASES[selectedCategory].map((phrase) => (
            <List.Item
              key={phrase.id}
              title={phrase.text}
              description={selectedPhrase === phrase.text ? translatedPhrase : ''}
              onPress={() => handleTranslate(phrase.text)}
              right={(props) => (
                <View style={styles.actionButtons}>
                  {selectedPhrase === phrase.text && translatedPhrase && (
                    <>
                      <IconButton
                        {...props}
                        icon="content-copy"
                        onPress={() => copyToClipboard(`${phrase.text}\n${translatedPhrase}`)}
                      />
                      <IconButton
                        {...props}
                        icon={isFavorite({ original: phrase.text, translated: translatedPhrase }) ? 'star' : 'star-outline'}
                        onPress={() => handleFavorite({ original: phrase.text, translated: translatedPhrase })}
                      />
                      <IconButton
                        {...props}
                        icon="play"
                        onPress={() => handleSpeak(phrase.text, sourceLanguage)}
                      />
                      <IconButton
                        {...props}
                        icon="play"
                        onPress={() => handleSpeak(translatedPhrase, targetLanguage)}
                      />
                    </>
                  )}
                </View>
              )}
              style={[
                styles.phraseItem,
                selectedPhrase === phrase.text && styles.selectedPhraseItem
              ]}
            />
          ))}
        </List.Section>
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
    marginBottom: 16,
  },
  categories: {
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  phraseItem: {
    borderRadius: 8,
    marginVertical: 4,
  },
  selectedPhraseItem: {
    backgroundColor: '#f0f0f0',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TranslatedPhrase = {
  original: string;
  translated: string;
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<TranslatedPhrase[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (newFavorites: TranslatedPhrase[]) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = useCallback((phrase: TranslatedPhrase) => {
    setFavorites((current) => {
      const exists = current.some(
        (p) => p.original === phrase.original && p.translated === phrase.translated
      );
      
      const newFavorites = exists
        ? current.filter(
            (p) => !(p.original === phrase.original && p.translated === phrase.translated)
          )
        : [...current, phrase];
      
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((phrase: TranslatedPhrase) => {
    return favorites.some(
      (p) => p.original === phrase.original && p.translated === phrase.translated
    );
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
} 
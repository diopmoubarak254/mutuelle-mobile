import { create } from 'zustand';
import { useEffect } from 'react';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageState {
  language: string;
  setLanguage: (language: string) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'fr', // Default language is French
  setLanguage: (language) => {
    set({ language });
    // Save to persistent storage
    AsyncStorage.setItem('userLanguage', language).catch(console.error);
  },
}));

// Initialize language from storage or device locale
export const initializeLanguage = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem('userLanguage');
    
    if (storedLanguage) {
      useLanguageStore.setState({ language: storedLanguage });
    } else {
      // Get device locale and set closest matching supported language
      const deviceLocale = Localization.locale.split('-')[0];
      
      // Check if device locale is one of our supported languages
      const supportedLanguages = ['fr', 'wo', 'ff', 'srr'];
      const matchedLanguage = supportedLanguages.includes(deviceLocale) 
        ? deviceLocale 
        : 'fr'; // Default to French if no match
      
      useLanguageStore.setState({ language: matchedLanguage });
      AsyncStorage.setItem('userLanguage', matchedLanguage).catch(console.error);
    }
  } catch (error) {
    console.error('Language initialization error:', error);
  }
};

// Hook for components
export const useLanguage = () => {
  const { language, setLanguage } = useLanguageStore();
  
  useEffect(() => {
    // Initialize language when the hook is first used
    initializeLanguage();
  }, []);
  
  return { language, setLanguage };
};
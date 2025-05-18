import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Globe } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/hooks/useLanguage';

interface LanguageSwitcherProps {
  style?: any;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const LANGUAGES: Language[] = [
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'wo', name: 'Wolof', nativeName: 'Wolof' },
  { code: 'ff', name: 'Pulaar', nativeName: 'Pulaar' },
  { code: 'srr', name: 'Sérère', nativeName: 'Sérère' },
];

export default function LanguageSwitcher({ style }: LanguageSwitcherProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { language, setLanguage } = useLanguage();
  
  const selectedLanguage = LANGUAGES.find(lang => lang.code === language) || LANGUAGES[0];

  const handleSelectLanguage = (langCode: string) => {
    setLanguage(langCode);
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Globe size={18} color={Colors.primary[600]} />
        <Text style={styles.buttonText}>{selectedLanguage.code.toUpperCase()}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir une langue</Text>
            <ScrollView>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    lang.code === language && styles.selectedLanguage,
                  ]}
                  onPress={() => handleSelectLanguage(lang.code)}
                >
                  <Text 
                    style={[
                      styles.languageName,
                      lang.code === language && styles.selectedLanguageText,
                    ]}
                  >
                    {lang.nativeName}
                  </Text>
                  <Text style={styles.languageNameSecondary}>{lang.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary[100],
  },
  buttonText: {
    marginLeft: 6,
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.primary[600],
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '70%',
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  languageOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  selectedLanguage: {
    backgroundColor: Colors.primary[50],
    borderRadius: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 0,
    marginBottom: 8,
  },
  languageName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.primary,
  },
  selectedLanguageText: {
    color: Colors.primary[600],
  },
  languageNameSecondary: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  closeButton: {
    backgroundColor: Colors.gray[200],
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.primary,
  },
});
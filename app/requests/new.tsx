import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, ChevronDown, Upload } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTranslation } from '@/hooks/useTranslation';

const REQUEST_TYPES = [
  'Attestation d\'adhésion',
  'Demande de remboursement',
  'Carte de membre',
  'Renouvellement',
  'Attestation de couverture'
];

export default function NewRequestScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [requestType, setRequestType] = useState('');
  const [description, setDescription] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate request submission
    setTimeout(() => {
      setIsLoading(false);
      router.back();
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft color={Colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('newRequest.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>{t('newRequest.type')}</Text>
        <TouchableOpacity 
          style={styles.dropdown}
          onPress={() => setShowTypeDropdown(!showTypeDropdown)}
        >
          <Text style={[
            styles.dropdownText,
            !requestType && styles.placeholder
          ]}>
            {requestType || t('newRequest.selectType')}
          </Text>
          <ChevronDown size={20} color={Colors.gray[400]} />
        </TouchableOpacity>

        {showTypeDropdown && (
          <View style={styles.dropdownMenu}>
            {REQUEST_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.dropdownItem}
                onPress={() => {
                  setRequestType(type);
                  setShowTypeDropdown(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  type === requestType && styles.dropdownItemSelected
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>{t('newRequest.description')}</Text>
        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          placeholder={t('newRequest.descriptionPlaceholder')}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.uploadButton}>
          <Upload size={20} color={Colors.primary[600]} />
          <Text style={styles.uploadButtonText}>{t('newRequest.attachFile')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? t('newRequest.submitting') : t('newRequest.submit')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dropdownText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.primary,
  },
  placeholder: {
    color: Colors.text.secondary,
  },
  dropdownMenu: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 12,
    marginTop: -8,
    marginBottom: 16,
    padding: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  dropdownItemText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.primary,
  },
  dropdownItemSelected: {
    color: Colors.primary[600],
  },
  textArea: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    minHeight: 120,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[50],
    borderWidth: 1,
    borderColor: Colors.primary[100],
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  uploadButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.primary[600],
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: Colors.primary[600],
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.primary[400],
  },
  submitButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
});
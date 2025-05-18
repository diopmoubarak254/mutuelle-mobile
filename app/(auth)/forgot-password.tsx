import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from '@/hooks/useTranslation';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (!email) {
        throw new Error(t('forgotPassword.emptyEmail'));
      }

      // In a real app, this would call the API
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
      }, 1500);
    } catch (err: any) {
      setError(err.message || t('forgotPassword.genericError'));
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft color={Colors.text.primary} size={24} />
          </TouchableOpacity>

          <View style={styles.contentContainer}>
            <Text style={styles.title}>{t('forgotPassword.title')}</Text>
            <Text style={styles.subtitle}>{t('forgotPassword.subtitle')}</Text>

            {!isSuccess ? (
              <>
                <View style={styles.inputContainer}>
                  <Mail color={Colors.gray[400]} size={20} />
                  <TextInput 
                    style={styles.input}
                    placeholder={t('forgotPassword.emailPlaceholder')}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity 
                  style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} 
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  <Text style={styles.submitButtonText}>
                    {isLoading ? t('forgotPassword.sending') : t('forgotPassword.submit')}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>{t('forgotPassword.successMessage')}</Text>
                <TouchableOpacity 
                  style={styles.backToLoginButton} 
                  onPress={() => router.replace('/login')}
                >
                  <Text style={styles.backToLoginText}>{t('forgotPassword.backToLogin')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    marginBottom: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 32,
    textAlign: 'center',
    maxWidth: 300,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
    backgroundColor: Colors.white,
    width: '100%',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Poppins-Regular',
    color: Colors.text.primary,
  },
  errorText: {
    color: Colors.error[500],
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.primary[600],
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.primary[400],
  },
  submitButtonText: {
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  successContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.success[600],
    textAlign: 'center',
    marginBottom: 24,
  },
  backToLoginButton: {
    borderWidth: 1,
    borderColor: Colors.primary[600],
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  backToLoginText: {
    color: Colors.primary[600],
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
});
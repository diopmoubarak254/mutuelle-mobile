import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Phone, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from '@/hooks/useTranslation';

export default function Register() {
  const { t } = useTranslation();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Validation
      if (!fullName || !email || !phone || !password || !confirmPassword) {
        throw new Error(t('register.emptyFields'));
      }

      if (password !== confirmPassword) {
        throw new Error(t('register.passwordMismatch'));
      }

      // In a real app, this would call the API
      // Simulating API call
      setTimeout(() => {
        setIsLoading(false);
        router.push('/verify-otp');
      }, 1500);
    } catch (err: any) {
      setError(err.message || t('register.genericError'));
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

          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>{t('register.createAccount')}</Text>
            <Text style={styles.welcomeSubtitle}>{t('register.subtitle')}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <User color={Colors.gray[400]} size={20} />
              <TextInput 
                style={styles.input}
                placeholder={t('register.fullNamePlaceholder')}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail color={Colors.gray[400]} size={20} />
              <TextInput 
                style={styles.input}
                placeholder={t('register.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Phone color={Colors.gray[400]} size={20} />
              <TextInput 
                style={styles.input}
                placeholder={t('register.phonePlaceholder')}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock color={Colors.gray[400]} size={20} />
              <TextInput 
                style={styles.input}
                placeholder={t('register.passwordPlaceholder')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                {isPasswordVisible ? (
                  <EyeOff color={Colors.gray[400]} size={20} />
                ) : (
                  <Eye color={Colors.gray[400]} size={20} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Lock color={Colors.gray[400]} size={20} />
              <TextInput 
                style={styles.input}
                placeholder={t('register.confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!isConfirmPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                {isConfirmPasswordVisible ? (
                  <EyeOff color={Colors.gray[400]} size={20} />
                ) : (
                  <Eye color={Colors.gray[400]} size={20} />
                )}
              </TouchableOpacity>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity 
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? t('register.registering') : t('register.register')}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>{t('register.haveAccount')} </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}>{t('register.login')}</Text>
              </TouchableOpacity>
            </View>
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
  welcomeContainer: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
  },
  form: {
    marginTop: 8,
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
    marginTop: -8,
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: Colors.primary[600],
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  registerButtonDisabled: {
    backgroundColor: Colors.primary[400],
  },
  registerButtonText: {
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontFamily: 'Poppins-Regular',
    color: Colors.text.secondary,
  },
  loginLink: {
    fontFamily: 'Poppins-Medium',
    color: Colors.primary[600],
  },
});
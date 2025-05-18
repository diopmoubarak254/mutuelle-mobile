import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login } = useAuth();
  const [isEmailLogin, setIsEmailLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (isEmailLogin && (!email || !password)) {
        throw new Error(t('login.emptyFields'));
      } else if (!isEmailLogin && (!phone || !password)) {
        throw new Error(t('login.emptyFields'));
      }

      // In a real app, this would call the API
      await login(isEmailLogin ? email : phone, password, isEmailLogin);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || t('login.genericError'));
    } finally {
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
          <View style={styles.header}>
            <Text style={styles.appName}>SamaMutuelle</Text>
            <LanguageSwitcher style={styles.langSwitcher} />
          </View>

          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>{t('login.welcome')}</Text>
            <Text style={styles.welcomeSubtitle}>{t('login.subtitle')}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                style={[styles.toggleButton, isEmailLogin && styles.activeToggle]} 
                onPress={() => setIsEmailLogin(true)}
              >
                <Text style={[styles.toggleText, isEmailLogin && styles.activeToggleText]}>
                  {t('login.email')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleButton, !isEmailLogin && styles.activeToggle]} 
                onPress={() => setIsEmailLogin(false)}
              >
                <Text style={[styles.toggleText, !isEmailLogin && styles.activeToggleText]}>
                  {t('login.phone')}
                </Text>
              </TouchableOpacity>
            </View>

            {isEmailLogin ? (
              <View style={styles.inputContainer}>
                <Mail color={Colors.gray[400]} size={20} />
                <TextInput 
                  style={styles.input}
                  placeholder={t('login.emailPlaceholder')}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            ) : (
              <View style={styles.inputContainer}>
                <Phone color={Colors.gray[400]} size={20} />
                <TextInput 
                  style={styles.input}
                  placeholder={t('login.phonePlaceholder')}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Lock color={Colors.gray[400]} size={20} />
              <TextInput 
                style={styles.input}
                placeholder={t('login.passwordPlaceholder')}
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

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Link href="/forgot-password" asChild>
                <Text style={styles.forgotPasswordText}>{t('login.forgotPassword')}</Text>
              </Link>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? t('login.loggingIn') : t('login.login')}
              </Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>{t('login.noAccount')} </Text>
              <Link href="/register" asChild>
                <Text style={styles.registerLink}>{t('login.register')}</Text>
              </Link>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 24,
    color: Colors.primary[600],
  },
  langSwitcher: {
    alignSelf: 'flex-end',
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
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  toggleText: {
    fontFamily: 'Poppins-Medium',
    color: Colors.gray[500],
  },
  activeToggleText: {
    color: Colors.primary[600],
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontFamily: 'Poppins-Medium',
    color: Colors.primary[600],
  },
  loginButton: {
    backgroundColor: Colors.primary[600],
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: Colors.primary[400],
  },
  loginButtonText: {
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    fontFamily: 'Poppins-Regular',
    color: Colors.text.secondary,
  },
  registerLink: {
    fontFamily: 'Poppins-Medium',
    color: Colors.primary[600],
  },
});
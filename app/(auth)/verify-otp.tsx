import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from '@/hooks/useTranslation';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withDelay
} from 'react-native-reanimated';

export default function VerifyOTP() {
  const { t } = useTranslation();
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([null, null, null, null]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const shake = useSharedValue(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const resendCode = () => {
    setTimeLeft(60);
  };

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    }
    
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    // Auto move to next input
    if (text !== '' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Go back on backspace if the field is empty
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const shakeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shake.value }],
    };
  });

  const triggerShake = () => {
    shake.value = withSequence(
      withTiming(10, { duration: 100 }),
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(-10, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
  };

  const verifyOTP = () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 4) {
      setError(t('verifyOtp.invalidOtp'));
      triggerShake();
      return;
    }

    setIsLoading(true);
    setError(null);

    // In a real app, this would verify the OTP with an API call
    setTimeout(() => {
      setIsLoading(false);
      // Simulate successful verification
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft color={Colors.text.primary} size={24} />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{t('verifyOtp.title')}</Text>
          <Text style={styles.subtitle}>{t('verifyOtp.subtitle')}</Text>
          
          <Animated.View style={[styles.otpContainer, shakeAnimatedStyle]}>
            {otp.map((digit, index) => (
              <View key={index} style={styles.otpInputWrapper}>
                <TextInput
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              </View>
            ))}
          </Animated.View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity 
            style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled]} 
            onPress={verifyOTP}
            disabled={isLoading}
          >
            <Text style={styles.verifyButtonText}>
              {isLoading ? t('verifyOtp.verifying') : t('verifyOtp.verify')}
            </Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>{t('verifyOtp.noCode')}</Text>
            {timeLeft > 0 ? (
              <Text style={styles.timerText}>
                {t('verifyOtp.resendIn', { seconds: timeLeft })}
              </Text>
            ) : (
              <TouchableOpacity onPress={resendCode}>
                <Text style={styles.resendLink}>{t('verifyOtp.resend')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  backButton: {
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: -80,
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
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 280,
    marginBottom: 24,
  },
  otpInputWrapper: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary[200],
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  otpInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.primary[600],
  },
  errorText: {
    color: Colors.error[500],
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: Colors.primary[600],
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    maxWidth: 280,
  },
  verifyButtonDisabled: {
    backgroundColor: Colors.primary[400],
  },
  verifyButtonText: {
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  resendContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  resendText: {
    fontFamily: 'Poppins-Regular',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  timerText: {
    fontFamily: 'Poppins-Medium',
    color: Colors.text.secondary,
  },
  resendLink: {
    fontFamily: 'Poppins-Medium',
    color: Colors.primary[600],
  },
});
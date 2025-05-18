import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, CreditCard, Smartphone } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTranslation } from '@/hooks/useTranslation';

export default function PaymentScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [amount, setAmount] = useState('5000');
  const [selectedMethod, setSelectedMethod] = useState<'mobile' | 'card'>('mobile');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    // Simulate payment processing
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
        <Text style={styles.headerTitle}>{t('payment.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>{t('payment.amount')}</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0"
          />
          <Text style={styles.currency}>FCFA</Text>
        </View>

        <Text style={styles.sectionTitle}>{t('payment.method')}</Text>
        
        <View style={styles.methodContainer}>
          <TouchableOpacity 
            style={[
              styles.methodOption,
              selectedMethod === 'mobile' && styles.methodSelected
            ]}
            onPress={() => setSelectedMethod('mobile')}
          >
            <Smartphone 
              size={24} 
              color={selectedMethod === 'mobile' ? Colors.primary[600] : Colors.gray[400]} 
            />
            <Text style={[
              styles.methodText,
              selectedMethod === 'mobile' && styles.methodTextSelected
            ]}>
              {t('payment.mobileMoney')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.methodOption,
              selectedMethod === 'card' && styles.methodSelected
            ]}
            onPress={() => setSelectedMethod('card')}
          >
            <CreditCard 
              size={24} 
              color={selectedMethod === 'card' ? Colors.primary[600] : Colors.gray[400]} 
            />
            <Text style={[
              styles.methodText,
              selectedMethod === 'card' && styles.methodTextSelected
            ]}>
              {t('payment.card')}
            </Text>
          </TouchableOpacity>
        </View>

        {selectedMethod === 'mobile' && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t('payment.phoneNumber')}</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="77 123 45 67"
              keyboardType="phone-pad"
            />
          </View>
        )}

        <TouchableOpacity 
          style={[styles.payButton, isLoading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={isLoading}
        >
          <Text style={styles.payButtonText}>
            {isLoading ? t('payment.processing') : t('payment.pay')}
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
  amountContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  amountLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  amountInput: {
    fontFamily: 'Poppins-Bold',
    fontSize: 48,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  currency: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  methodContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  methodOption: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  methodSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  methodText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
  },
  methodTextSelected: {
    color: Colors.primary[600],
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  payButton: {
    backgroundColor: Colors.primary[600],
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: Colors.primary[400],
  },
  payButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
});
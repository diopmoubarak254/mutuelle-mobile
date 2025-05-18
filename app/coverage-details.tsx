import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Shield, Users, Calendar, CreditCard, FileText } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTranslation } from '@/hooks/useTranslation';

export default function CoverageDetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();

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
        <Text style={styles.headerTitle}>{t('coverage.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.coverageCard}>
          <View style={styles.coverageHeader}>
            <Shield size={24} color={Colors.primary[600]} />
            <Text style={styles.coverageTitle}>{t('coverage.currentPlan')}</Text>
          </View>
          
          <View style={styles.coverageDetails}>
            <Text style={styles.planName}>Plan Familial Premium</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{t('coverage.active')}</Text>
            </View>
          </View>

          <View style={styles.coverageInfo}>
            <View style={styles.infoItem}>
              <Users size={20} color={Colors.gray[500]} />
              <Text style={styles.infoLabel}>{t('coverage.beneficiaries')}</Text>
              <Text style={styles.infoValue}>4 personnes</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Calendar size={20} color={Colors.gray[500]} />
              <Text style={styles.infoLabel}>{t('coverage.renewalDate')}</Text>
              <Text style={styles.infoValue}>15 juillet 2024</Text>
            </View>
            
            <View style={styles.infoItem}>
              <CreditCard size={20} color={Colors.gray[500]} />
              <Text style={styles.infoLabel}>{t('coverage.monthlyPayment')}</Text>
              <Text style={styles.infoValue}>5,000 FCFA</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('coverage.benefits')}</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitTitle}>{t('coverage.consultations')}</Text>
              <Text style={styles.benefitValue}>80% couvert</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitTitle}>{t('coverage.hospitalization')}</Text>
              <Text style={styles.benefitValue}>70% couvert</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitTitle}>{t('coverage.pharmacy')}</Text>
              <Text style={styles.benefitValue}>60% couvert</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitTitle}>{t('coverage.dental')}</Text>
              <Text style={styles.benefitValue}>50% couvert</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('coverage.documents')}</Text>
          <TouchableOpacity 
            style={styles.documentButton}
            onPress={() => router.push('/documents')}
          >
            <FileText size={20} color={Colors.primary[600]} />
            <Text style={styles.documentButtonText}>{t('coverage.viewDocuments')}</Text>
          </TouchableOpacity>
        </View>
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
  coverageCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  coverageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  coverageTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
    marginLeft: 12,
  },
  coverageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  planName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.text.primary,
  },
  statusBadge: {
    backgroundColor: Colors.success[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.success[100],
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.success[700],
  },
  coverageInfo: {
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
    marginLeft: 12,
  },
  infoValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.text.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  benefitsList: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  benefitTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.primary,
  },
  benefitValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.primary[600],
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    borderWidth: 1,
    borderColor: Colors.primary[100],
    borderRadius: 12,
    padding: 16,
  },
  documentButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.primary[600],
    marginLeft: 12,
  },
});
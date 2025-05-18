import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Shield, FileText, AlertCircle, CreditCard } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTranslation } from '@/hooks/useTranslation';

const ACTIVITIES = [
  {
    id: '1',
    type: 'payment',
    title: 'Paiement réussi',
    amount: '5,000 FCFA',
    date: '15 mars 2024',
    status: 'success'
  },
  {
    id: '2',
    type: 'document',
    title: 'Demande de document',
    description: 'Attestation de couverture',
    date: '10 mars 2024',
    status: 'approved'
  },
  {
    id: '3',
    type: 'alert',
    title: 'Rappel de renouvellement',
    description: 'Votre couverture expire dans 15 jours',
    date: '5 mars 2024',
    status: 'pending'
  },
  {
    id: '4',
    type: 'payment',
    title: 'Paiement réussi',
    amount: '5,000 FCFA',
    date: '15 février 2024',
    status: 'success'
  }
];

export default function ActivityScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCard size={20} color={Colors.success[600]} />;
      case 'document':
        return <FileText size={20} color={Colors.info[600]} />;
      case 'alert':
        return <AlertCircle size={20} color={Colors.warning[600]} />;
      default:
        return <Shield size={20} color={Colors.primary[600]} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'payment':
        return Colors.success;
      case 'document':
        return Colors.info;
      case 'alert':
        return Colors.warning;
      default:
        return Colors.primary;
    }
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
        <Text style={styles.headerTitle}>{t('activity.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {ACTIVITIES.map((activity) => {
          const activityColor = getActivityColor(activity.type);
          
          return (
            <View key={activity.id} style={styles.activityCard}>
              <View style={[styles.activityIcon, { backgroundColor: activityColor[50] }]}>
                {getActivityIcon(activity.type)}
              </View>
              
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                {activity.amount ? (
                  <Text style={[styles.activityAmount, { color: activityColor[600] }]}>
                    {activity.amount}
                  </Text>
                ) : (
                  <Text style={styles.activityDescription}>
                    {activity.description}
                  </Text>
                )}
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>

              <View style={[
                styles.statusBadge,
                { backgroundColor: activityColor[50] }
              ]}>
                <Text style={[styles.statusText, { color: activityColor[700] }]}>
                  {t(`activity.status.${activity.status}`)}
                </Text>
              </View>
            </View>
          );
        })}
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
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  activityAmount: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    marginBottom: 4,
  },
  activityDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  activityDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
});
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Bell, Calendar, CreditCard, FileText, CircleAlert as AlertCircle, Shield, FilePlus } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const { hasUnreadNotifications } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [coverageStatus, setCoverageStatus] = useState<'active' | 'pending' | 'expired'>('active');
  const [coveragePercent, setCoveragePercent] = useState(75);
  const [nextPaymentDue, setNextPaymentDue] = useState(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000));
  const [quickActions, setQuickActions] = useState([
    { id: 1, name: t('home.payContribution'), icon: CreditCard, color: Colors.primary[500] },
    { id: 2, name: t('home.makeRequest'), icon: FilePlus, color: Colors.secondary[500] },
    { id: 3, name: t('home.viewDocuments'), icon: FileText, color: Colors.tertiary[500] },
  ]);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCoverageStatusText = () => {
    switch (coverageStatus) {
      case 'active': return t('home.coverageActive');
      case 'pending': return t('home.coveragePending');
      case 'expired': return t('home.coverageExpired');
      default: return '';
    }
  };

  const getCoverageStatusColor = () => {
    switch (coverageStatus) {
      case 'active': return Colors.success[500];
      case 'pending': return Colors.warning[500];
      case 'expired': return Colors.error[500];
      default: return Colors.gray[500];
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color={Colors.primary[600]} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{t('home.greeting')},</Text>
            <Text style={styles.username}>{user?.fullName || 'User'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <Bell color={Colors.text.primary} size={24} />
            {hasUnreadNotifications && <View style={styles.notificationBadge} />}
          </TouchableOpacity>
        </View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <LinearGradient
            colors={[Colors.primary[600], Colors.primary[800]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.coverageCard}
          >
            <View style={styles.coverageCardHeader}>
              <Text style={styles.coverageCardTitle}>{t('home.coverageStatus')}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getCoverageStatusColor() }]}>
                <Text style={styles.statusBadgeText}>{getCoverageStatusText()}</Text>
              </View>
            </View>
            
            <View style={styles.coverageInfoRow}>
              <View style={styles.coveragePercentContainer}>
                <Text style={styles.coveragePercentText}>{coveragePercent}%</Text>
                <Text style={styles.coverageLabel}>{t('home.coverageLabel')}</Text>
              </View>
              
              <View style={styles.dueDateContainer}>
                <Calendar color={Colors.white} size={18} />
                <Text style={styles.dueDateLabel}>{t('home.nextPayment')}</Text>
                <Text style={styles.dueDate}>{formatDate(nextPaymentDue)}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={() => router.push('/coverage-details')}
            >
              <Text style={styles.detailsButtonText}>{t('home.viewDetails')}</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
        </View>
        
        <View style={styles.quickActions}>
          {quickActions.map((action, index) => (
            <Animated.View 
              key={action.id}
              entering={FadeInRight.delay(300 + index * 100).duration(500)}
              style={styles.quickActionItem}
            >
              <TouchableOpacity 
                style={[styles.quickActionButton, { backgroundColor: action.color }]}
                onPress={() => {
                  if (action.id === 1) router.push('/payment');
                  if (action.id === 2) router.push('/requests/new');
                  if (action.id === 3) router.push('/documents');
                }}
              >
                <action.icon color={Colors.white} size={24} />
              </TouchableOpacity>
              <Text style={styles.quickActionText}>{action.name}</Text>
            </Animated.View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.recentActivity')}</Text>
          <TouchableOpacity onPress={() => router.push('/activity')}>
            <Text style={styles.seeAllText}>{t('home.seeAll')}</Text>
          </TouchableOpacity>
        </View>

        <Animated.View entering={FadeInDown.delay(600).duration(500)}>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: Colors.success[100] }]}>
              <Shield color={Colors.success[600]} size={20} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{t('home.paymentSuccessful')}</Text>
              <Text style={styles.activityDate}>15 juin 2023</Text>
            </View>
            <Text style={styles.activityAmount}>5,000 FCFA</Text>
          </View>

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: Colors.info[100] }]}>
              <FileText color={Colors.info[600]} size={20} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{t('home.documentRequest')}</Text>
              <Text style={styles.activityDate}>10 juin 2023</Text>
            </View>
            <Text style={styles.activityStatus}>{t('home.approved')}</Text>
          </View>

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: Colors.warning[100] }]}>
              <AlertCircle color={Colors.warning[600]} size={20} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{t('home.renewalReminder')}</Text>
              <Text style={styles.activityDate}>5 juin 2023</Text>
            </View>
            <Text style={styles.activityStatus}>{t('home.pending')}</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  greeting: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
  },
  username: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: Colors.text.primary,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.error[500],
    position: 'absolute',
    top: 12,
    right: 12,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  coverageCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.primary[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  coverageCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  coverageCardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.white,
  },
  coverageInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  coveragePercentContainer: {
    alignItems: 'flex-start',
  },
  coveragePercentText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: Colors.white,
  },
  coverageLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
  },
  dueDateContainer: {
    alignItems: 'flex-end',
  },
  dueDateLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    marginTop: 4,
    marginBottom: 2,
  },
  dueDate: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.white,
  },
  detailsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
  },
  seeAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary[600],
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  activityDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  activityAmount: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.success[600],
  },
  activityStatus: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.info[600],
  },
});
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import Colors from '@/constants/Colors';
import { User, CreditCard, Settings, CircleHelp as HelpCircle, LogOut, ChevronRight, Bell, Globe, Lock, Phone, Mail } from 'lucide-react-native';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      t('profile.logoutTitle'),
      t('profile.logoutMessage'),
      [
        {
          text: t('profile.cancel'),
          style: 'cancel',
        },
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('profile.title')}</Text>
          <LanguageSwitcher style={styles.langSwitcher} />
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitials}>
                {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
              </Text>
            </View>
          </View>
          <Text style={styles.profileName}>{user?.fullName || 'User'}</Text>
          <View style={styles.profileInfo}>
            <View style={styles.infoItem}>
              <Mail size={16} color={Colors.gray[500]} />
              <Text style={styles.infoText}>{user?.email || 'email@example.com'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Phone size={16} color={Colors.gray[500]} />
              <Text style={styles.infoText}>{user?.phone || '+221 77 123 45 67'}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => router.push('/edit-profile')}
          >
            <Text style={styles.editProfileButtonText}>{t('profile.editProfile')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.account')}</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/personal-info')}
          >
            <User size={20} color={Colors.primary[600]} />
            <Text style={styles.menuItemText}>{t('profile.personalInfo')}</Text>
            <ChevronRight size={20} color={Colors.gray[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/payment-methods')}
          >
            <CreditCard size={20} color={Colors.secondary[600]} />
            <Text style={styles.menuItemText}>{t('profile.paymentMethods')}</Text>
            <ChevronRight size={20} color={Colors.gray[400]} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.preferences')}</Text>
          
          <View style={styles.menuItem}>
            <Bell size={20} color={Colors.tertiary[600]} />
            <Text style={styles.menuItemText}>{t('profile.notifications')}</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.gray[300], true: Colors.primary[200] }}
              thumbColor={notificationsEnabled ? Colors.primary[600] : Colors.white}
            />
          </View>

          <View style={styles.menuItem}>
            <Lock size={20} color={Colors.info[600]} />
            <Text style={styles.menuItemText}>{t('profile.biometric')}</Text>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: Colors.gray[300], true: Colors.primary[200] }}
              thumbColor={biometricEnabled ? Colors.primary[600] : Colors.white}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.support')}</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/help-center')}
          >
            <HelpCircle size={20} color={Colors.warning[600]} />
            <Text style={styles.menuItemText}>{t('profile.helpCenter')}</Text>
            <ChevronRight size={20} color={Colors.gray[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/settings')}
          >
            <Settings size={20} color={Colors.gray[600]} />
            <Text style={styles.menuItemText}>{t('profile.settings')}</Text>
            <ChevronRight size={20} color={Colors.gray[400]} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color={Colors.error[600]} />
          <Text style={styles.logoutButtonText}>{t('profile.logout')}</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>SamaMutuelle v1.0.0</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.text.primary,
  },
  langSwitcher: {
    alignSelf: 'flex-end',
  },
  profileCard: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImageContainer: {
    marginVertical: 16,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
    color: Colors.primary[700],
  },
  profileName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  profileInfo: {
    width: '100%',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  editProfileButton: {
    backgroundColor: Colors.primary[600],
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  editProfileButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.white,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemText: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error[50],
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error[100],
    marginBottom: 24,
  },
  logoutButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.error[600],
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 32,
  },
});
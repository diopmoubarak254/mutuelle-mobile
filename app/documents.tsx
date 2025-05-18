import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, FileText, Download, Eye } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTranslation } from '@/hooks/useTranslation';

const DOCUMENTS = [
  {
    id: '1',
    name: 'Attestation de couverture',
    date: '15/03/2024',
    type: 'PDF',
    size: '245 KB'
  },
  {
    id: '2',
    name: 'Carte de membre',
    date: '01/01/2024',
    type: 'PDF',
    size: '128 KB'
  },
  {
    id: '3',
    name: 'Reçu de paiement - Mars 2024',
    date: '01/03/2024',
    type: 'PDF',
    size: '156 KB'
  },
  {
    id: '4',
    name: 'Contrat d\'adhésion',
    date: '01/01/2024',
    type: 'PDF',
    size: '512 KB'
  }
];

export default function DocumentsScreen() {
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
        <Text style={styles.headerTitle}>{t('documents.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {DOCUMENTS.map((document) => (
          <View key={document.id} style={styles.documentCard}>
            <View style={styles.documentIcon}>
              <FileText size={24} color={Colors.primary[600]} />
            </View>
            
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>{document.name}</Text>
              <View style={styles.documentMeta}>
                <Text style={styles.documentDate}>{document.date}</Text>
                <Text style={styles.documentSize}>{document.size}</Text>
              </View>
            </View>

            <View style={styles.documentActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Eye size={20} color={Colors.primary[600]} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Download size={20} color={Colors.primary[600]} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  documentCard: {
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
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentInfo: {
    flex: 1,
    marginLeft: 16,
  },
  documentName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginRight: 12,
  },
  documentSize: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  documentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
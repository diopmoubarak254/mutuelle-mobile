import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FilePlus, FileText, CircleCheck as CheckCircle, Clock, X, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { useTranslation } from '@/hooks/useTranslation';

type RequestStatus = 'pending' | 'approved' | 'rejected';

interface Request {
  id: string;
  type: string;
  status: RequestStatus;
  date: string;
  number: string;
}

const SAMPLE_REQUESTS: Request[] = [
  {
    id: '1',
    type: 'Attestation d\'adhésion',
    status: 'approved',
    date: '20/05/2023',
    number: 'REQ-2023-001'
  },
  {
    id: '2',
    type: 'Demande de remboursement',
    status: 'pending',
    date: '15/05/2023',
    number: 'REQ-2023-002'
  },
  {
    id: '3',
    type: 'Carte de membre',
    status: 'rejected',
    date: '10/05/2023',
    number: 'REQ-2023-003'
  },
  {
    id: '4',
    type: 'Renouvellement',
    status: 'approved',
    date: '05/05/2023',
    number: 'REQ-2023-004'
  },
  {
    id: '5',
    type: 'Attestation de couverture',
    status: 'pending',
    date: '01/05/2023',
    number: 'REQ-2023-005'
  }
];

export default function RequestsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [requests, setRequests] = useState<Request[]>(SAMPLE_REQUESTS);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={18} color={Colors.success[500]} />;
      case 'pending':
        return <Clock size={18} color={Colors.warning[500]} />;
      case 'rejected':
        return <X size={18} color={Colors.error[500]} />;
      default:
        return <AlertCircle size={18} color={Colors.gray[500]} />;
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'approved':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'rejected':
        return Colors.error;
      default:
        return Colors.gray;
    }
  };

  const getStatusText = (status: RequestStatus) => {
    switch (status) {
      case 'approved':
        return t('requests.statusApproved');
      case 'pending':
        return t('requests.statusPending');
      case 'rejected':
        return t('requests.statusRejected');
      default:
        return '';
    }
  };

  const filteredRequests = requests.filter(request => {
    if (activeTab === 'all') return true;
    return request.status === activeTab;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('requests.title')}</Text>
        <TouchableOpacity 
          style={styles.newRequestButton}
          onPress={() => router.push('/requests/new')}
        >
          <FilePlus size={20} color={Colors.white} />
          <Text style={styles.newRequestButtonText}>{t('requests.newRequest')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]} 
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            {t('requests.tabAll')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]} 
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            {t('requests.tabPending')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'approved' && styles.activeTab]} 
          onPress={() => setActiveTab('approved')}
        >
          <Text style={[styles.tabText, activeTab === 'approved' && styles.activeTabText]}>
            {t('requests.tabApproved')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'rejected' && styles.activeTab]} 
          onPress={() => setActiveTab('rejected')}
        >
          <Text style={[styles.tabText, activeTab === 'rejected' && styles.activeTabText]}>
            {t('requests.tabRejected')}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary[600]} />
        </View>
      ) : filteredRequests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FileText size={48} color={Colors.gray[300]} />
          <Text style={styles.emptyText}>
            {activeTab === 'all' 
              ? t('requests.noRequestsAll') 
              : t('requests.noRequestsFiltered', { status: getStatusText(activeTab as RequestStatus).toLowerCase() })}
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => router.push('/requests/new')}
          >
            <Text style={styles.emptyButtonText}>{t('requests.createFirst')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredRequests}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.requestsList}
          renderItem={({ item, index }) => {
            const statusColor = getStatusColor(item.status);
            
            return (
              <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
                <TouchableOpacity 
                  style={styles.requestCard}
                  onPress={() => router.push(`/requests/${item.id}`)}
                >
                  <View style={styles.requestHeader}>
                    <View style={styles.requestType}>
                      <FileText size={18} color={Colors.primary[600]} />
                      <Text style={styles.requestTypeText}>{item.type}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge, 
                      { backgroundColor: statusColor[50], borderColor: statusColor[100] }
                    ]}>
                      {getStatusIcon(item.status)}
                      <Text style={[styles.statusText, { color: statusColor[700] }]}>
                        {getStatusText(item.status)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.requestDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{t('requests.requestNumber')}</Text>
                      <Text style={styles.detailValue}>{item.number}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{t('requests.submissionDate')}</Text>
                      <Text style={styles.detailValue}>{item.date}</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.viewDetailsButton}
                    onPress={() => router.push(`/requests/${item.id}`)}
                  >
                    <Text style={styles.viewDetailsText}>{t('requests.viewDetails')}</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
        />
      )}
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.text.primary,
  },
  newRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[600],
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  newRequestButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.white,
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary[600],
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.primary[600],
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: Colors.primary[600],
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.white,
  },
  requestsList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  requestCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  requestType: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  requestTypeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 12,
    flexShrink: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
  requestDetails: {
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  detailValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.primary,
  },
  viewDetailsButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  viewDetailsText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary[600],
  },
});
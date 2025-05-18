import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Dimensions, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Search, Filter, MapPin, Star, Phone, Navigation2, Clock, Info } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useTranslation } from '@/hooks/useTranslation';
import Colors from '@/constants/Colors';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

// Only import MapView when not on web
let MapView: any;
let Marker: any;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}

const INITIAL_REGION = {
  latitude: 14.6937,
  longitude: -17.4441,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const FAKE_FACILITIES = [
  {
    id: 1,
    name: 'Hôpital Général de Grand Yoff',
    address: 'Rue 10, Grand Yoff, Dakar',
    phone: '33 825 40 30',
    rating: 4.5,
    type: 'hospital',
    image: 'https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    latitude: 14.7324,
    longitude: -17.4469,
    specialties: ['emergency', 'pediatrics', 'surgery'],
    openingHours: '24/7',
    distance: '2.3 km'
  },
  {
    id: 2,
    name: 'Clinique Médisun',
    address: 'Avenue Cheikh Anta Diop, Dakar',
    phone: '33 864 50 70',
    rating: 4.2,
    type: 'clinic',
    image: 'https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    latitude: 14.6901,
    longitude: -17.4558,
    specialties: ['cardiology', 'gynecology'],
    openingHours: '08:00 - 20:00',
    distance: '1.5 km'
  },
  {
    id: 3,
    name: 'Centre de Santé Philippe Senghor',
    address: 'Yoff Ouest Foire, Dakar',
    phone: '33 820 72 82',
    rating: 3.8,
    type: 'center',
    image: 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    latitude: 14.7486,
    longitude: -17.4843,
    specialties: ['general', 'maternity'],
    openingHours: '08:00 - 18:00',
    distance: '3.1 km'
  },
  {
    id: 4,
    name: 'Hôpital Militaire de Ouakam',
    address: 'Ouakam, Dakar',
    phone: '33 820 02 06',
    rating: 4.0,
    type: 'hospital',
    image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    latitude: 14.7219,
    longitude: -17.4978,
    specialties: ['emergency', 'orthopedics'],
    openingHours: '24/7',
    distance: '4.2 km'
  },
  {
    id: 5,
    name: 'Clinique Casahous',
    address: 'Ngor Extension, Dakar',
    phone: '33 869 80 80',
    rating: 4.7,
    type: 'clinic',
    image: 'https://images.pexels.com/photos/1692693/pexels-photo-1692693.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    latitude: 14.7532,
    longitude: -17.5031,
    specialties: ['dermatology', 'ophthalmology'],
    openingHours: '09:00 - 19:00',
    distance: '5.0 km'
  }
];

export default function FacilitiesScreen() {
  const { t } = useTranslation();
  const [location, setLocation] = useState<null | { latitude: number, longitude: number }>(null);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [facilities, setFacilities] = useState(FAKE_FACILITIES);
  const [searchText, setSearchText] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<null | any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const mapRef = useRef<any>(null);

  const specialties = [
    { name: 'emergency', label: t('facilities.filters.emergency') },
    { name: 'pediatrics', label: t('facilities.filters.pediatrics') },
    { name: 'cardiology', label: t('facilities.filters.cardiology') },
    { name: 'maternity', label: t('facilities.filters.maternity') },
    { name: 'surgery', label: t('facilities.filters.surgery') },
    { name: 'general', label: t('facilities.filters.general') },
  ];

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') {
        setIsLoading(false);
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg(t('facilities.locationPermissionDenied'));
        setIsLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
      } catch (error) {
        console.log('Error getting location', error);
        setErrorMsg(t('facilities.locationError'));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const filteredFacilities = facilities.filter(facility => {
    // Text search
    const matchesSearch = 
      searchText === '' || 
      facility.name.toLowerCase().includes(searchText.toLowerCase()) ||
      facility.address.toLowerCase().includes(searchText.toLowerCase());
    
    // Specialty filters
    const matchesFilters = 
      selectedFilters.length === 0 || 
      selectedFilters.some(filter => facility.specialties.includes(filter));
    
    return matchesSearch && matchesFilters;
  });

  const focusFacility = (facility: any) => {
    setSelectedFacility(facility);
    if (Platform.OS !== 'web' && mapRef.current) {
      mapRef.current?.animateToRegion({
        latitude: facility.latitude,
        longitude: facility.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      }, 500);
    }
  };

  const renderMap = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={[styles.mapContainer, styles.webMapPlaceholder]}>
          <Text style={styles.webMapText}>{t('facilities.mapNotAvailable')}</Text>
          <Text style={styles.webMapSubtext}>{t('facilities.useAppForMap')}</Text>
        </View>
      );
    }

    return (
      <View style={styles.mapContainer}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary[600]} />
            <Text style={styles.loaderText}>{t('facilities.loading')}</Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={location ? {
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            } : INITIAL_REGION}
            showsUserLocation={!!location}
          >
            {filtere

dFacilities.map((facility) => (
              <Marker
                key={facility.id}
                coordinate={{
                  latitude: facility.latitude,
                  longitude: facility.longitude
                }}
                title={facility.name}
                description={facility.address}
                pinColor={Colors.primary[500]}
                onPress={() => setSelectedFacility(facility)}
              />
            ))}
          </MapView>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('facilities.title')}</Text>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={Colors.gray[400]} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('facilities.searchPlaceholder')}
              placeholderTextColor={Colors.gray[400]}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity 
            style={[
              styles.filterButton,
              showFilters && styles.filterButtonActive
            ]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={showFilters ? Colors.primary[600] : Colors.gray[500]} />
          </TouchableOpacity>
        </View>
      </View>
      
      {showFilters && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {specialties.map((specialty, index) => (
            <TouchableOpacity
              key={specialty.name}
              style={[
                styles.filterChip,
                selectedFilters.includes(specialty.name) && styles.filterChipActive
              ]}
              onPress={() => toggleFilter(specialty.name)}
            >
              <Text 
                style={[
                  styles.filterChipText,
                  selectedFilters.includes(specialty.name) && styles.filterChipTextActive
                ]}
              >
                {specialty.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {renderMap()}

      <View style={styles.facilitiesListContainer}>
        <Text style={styles.facilitiesListTitle}>
          {filteredFacilities.length} {t('facilities.resultsFound')}
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.facilitiesList}
        >
          {filteredFacilities.map((facility, index) => (
            <Animated.View 
              key={facility.id}
              entering={FadeInUp.delay(index * 100).duration(400)}
            >
              <TouchableOpacity 
                style={[
                  styles.facilityCard,
                  selectedFacility?.id === facility.id && styles.facilityCardSelected
                ]}
                onPress={() => focusFacility(facility)}
              >
                <Image 
                  source={{ uri: facility.image }}
                  style={styles.facilityImage}
                />
                
                <View style={styles.facilityContent}>
                  <View style={styles.facilityHeader}>
                    <Text style={styles.facilityName}>{facility.name}</Text>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color={Colors.warning[500]} fill={Colors.warning[500]} />
                      <Text style={styles.ratingText}>{facility.rating}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.facilityDetails}>
                    <View style={styles.detailRow}>
                      <MapPin size={16} color={Colors.gray[500]} />
                      <Text style={styles.detailText}>
                        {facility.address}
                        <Text style={styles.distanceText}> • {facility.distance}</Text>
                      </Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Clock size={16} color={Colors.gray[500]} />
                      <Text style={styles.detailText}>{facility.openingHours}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Phone size={16} color={Colors.gray[500]} />
                      <Text style={styles.detailText}>{facility.phone}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.specialtiesContainer}>
                    {facility.specialties.map((specialty) => (
                      <View key={specialty} style={styles.specialtyChip}>
                        <Text style={styles.specialtyText}>
                          {t(`facilities.filters.${specialty}`)}
                        </Text>
                      </View>
                    ))}
                  </View>
                  
                  <View style={styles.facilityCta}>
                    <TouchableOpacity style={styles.infoButton}>
                      <Info size={16} color={Colors.primary[600]} />
                      <Text style={styles.infoButtonText}>{t('facilities.moreInfo')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.directionsButton}>
                      <Navigation2 size={16} color={Colors.white} />
                      <Text style={styles.directionsButtonText}>{t('facilities.getDirections')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.primary,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  filterButtonActive: {
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[200],
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[600],
  },
  filterChipText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: Colors.text.secondary,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  mapContainer: {
    flex: 2,
    overflow: 'hidden',
    borderRadius: 20,
    margin: 16,
  },
  webMapPlaceholder: {
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  webMapText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  webMapSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
  },
  loaderText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 12,
  },
  facilitiesListContainer: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 16,
  },
  facilitiesListTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  facilitiesList: {
    paddingHorizontal: 16,
  },
  facilityCard: {
    width: width * 0.85,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    overflow: 'hidden',
  },
  facilityCardSelected: {
    borderColor: Colors.primary[600],
    borderWidth: 2,
  },
  facilityImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  facilityContent: {
    padding: 16,
  },
  facilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  facilityName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    flexShrink: 1,
    width: '80%',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.warning[700],
    marginLeft: 4,
  },
  facilityDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
    flexShrink: 1,
  },
  distanceText: {
    color: Colors.primary[600],
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  specialtyChip: {
    backgroundColor: Colors.gray[100],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  facilityCta: {
    flexDirection: 'row',
    gap: 12,
  },
  infoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary[100],
  },
  infoButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary[600],
    marginLeft: 8,
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary[600],
    borderRadius: 8,
  },
  directionsButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.white,
    marginLeft: 8,
  },
});
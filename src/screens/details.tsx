import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import {RootStackParamList} from '../navigation/main';
import {courtsData} from '../data/courts';
import {ArrowLeftIcon} from '../assets/svg/arrow-left-icon';

type CourtDetailsRouteProp = RouteProp<RootStackParamList, 'CourtDetails'>;

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push('★');
  }
  if (halfStar) {
    stars.push('☆');
  }
  while (stars.length < 5) {
    stars.push('☆');
  }
  return (
    <Text style={styles.stars}>
      {stars.join(' ')}{' '}
      <Text style={styles.ratingNum}>{rating.toFixed(1)}</Text>
    </Text>
  );
};

export const CourtDetailsScreen = () => {
  const route = useRoute<CourtDetailsRouteProp>();
  const {courtId} = route.params;
  const navigation = useNavigation();

  const court = courtsData.find(c => c.id === courtId);

  if (!court) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowLeftIcon width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Court Details</Text>
        </View>
        <View style={styles.container}>
          <Text>Court not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeftIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Court Details</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Image source={court.image} style={styles.banner} />
          <Text style={styles.name}>{court.name}</Text>
          <Text style={styles.workingHours}>{court.workingHours}</Text>
          <View style={styles.row}>
            <Text
              style={[
                styles.status,
                // eslint-disable-next-line react-native/no-inline-styles
                {color: court.available ? '#4CAF50' : '#F44336'},
              ]}>
              {court.available ? 'Available' : 'Fully Booked'}
            </Text>
            {renderStars(court.rating)}
          </View>
          <Text style={styles.address}>{court.address}</Text>
          <Text style={styles.description}>{court.description}</Text>
          <View style={styles.servicesRow}>
            {court.services.map(service => (
              <View key={service} style={styles.servicePill}>
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>
          <View style={styles.mapContainer}>
            <Text style={styles.mapTitle}>Location</Text>
            <View style={styles.mapWrapper}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: court.location.latitude,
                  longitude: court.location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}>
                <Marker
                  coordinate={{
                    latitude: court.location.latitude,
                    longitude: court.location.longitude,
                  }}
                  title={court.name}
                  description={court.address}
                />
              </MapView>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#E0E0E0',
  },
  container: {
    paddingVertical: 32,
    backgroundColor: '#1A1A1A',
  },
  banner: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
  },
  content: {
    paddingTop: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    color: '#BBBBBB',
    marginBottom: 10,
  },
  workingHours: {
    fontSize: 15,
    color: '#8FA2A2',
    marginBottom: 10,
    fontWeight: '500',
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 14,
    gap: 16,
  },
  stars: {
    fontSize: 20,
    color: '#FFD700',
    fontWeight: '600',
  },
  ratingNum: {
    fontSize: 16,
    color: '#BBBBBB',
    fontWeight: '400',
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 18,
    lineHeight: 22,
  },
  servicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  servicePill: {
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  serviceText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '500',
  },
  mapContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E0E0E0',
    marginBottom: 12,
  },
  mapWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    width: Dimensions.get('window').width - 32,
    height: 200,
  },
});

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/main';
import {COLORS} from '../constants/colors';
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
        <Image source={{uri: court.image}} style={styles.banner} />
        <View style={styles.content}>
          <Text style={styles.name}>{court.name}</Text>
          <Text style={styles.address}>{court.address}</Text>
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
          <Text style={styles.description}>{court.description}</Text>
          <View style={styles.servicesRow}>
            {court.services.map(service => (
              <View key={service} style={styles.servicePill}>
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fdf9f4',
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
    color: COLORS.black,
  },
  container: {
    paddingVertical: 32,
    backgroundColor: '#fdf9f4',
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
    color: '#222',
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    color: COLORS.greyPrimary,
    marginBottom: 10,
  },
  workingHours: {
    fontSize: 15,
    color: '#6d7a7a',
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
    color: COLORS.greyPrimary,
    fontWeight: '400',
  },
  description: {
    fontSize: 16,
    color: '#444',
    marginBottom: 18,
    lineHeight: 22,
  },
  servicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  servicePill: {
    backgroundColor: '#f1ede7',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 8,
  },
  serviceText: {
    color: COLORS.greyPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
});

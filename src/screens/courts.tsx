import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {IMAGES} from '../constants/images';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SearchInput} from '../components/search-input';
import {courtsData} from '../data/courts';
import {ArrowRightIcon} from '../assets/svg/arrow-right-icon';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/main';

type CourtsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CourtsScreen = () => {
  const [search, setSearch] = useState('');
  const navigation = useNavigation<CourtsScreenNavigationProp>();

  const filteredCourts = courtsData.filter(
    court =>
      court.name.toLowerCase().includes(search.toLowerCase()) ||
      court.address.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Courts</Text>
      <SearchInput onSearch={setSearch} placeholder="Search" />

      {filteredCourts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={IMAGES.noCourts}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>No courts found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCourts}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('CourtDetails', {courtId: item.id})
              }>
              <Image source={item.image} style={styles.cardImage} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardAddress}>{item.address}</Text>
              </View>
              <ArrowRightIcon width={24} height={24} />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#E0E0E0',
    marginBottom: 16,
  },
  listContent: {
    marginTop: 16,
    paddingHorizontal: 0,
    paddingBottom: 32,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E0E0E0',
  },
  cardAddress: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 2,
  },
  arrow: {
    fontSize: 28,
    color: '#AAAAAA',
    marginLeft: 8,
    fontWeight: '300',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyImage: {
    width: 220,
    height: 180,
    tintColor: '#2A2A2A',
  },
  emptyText: {
    fontSize: 20,
    color: '#AAAAAA',
  },
});

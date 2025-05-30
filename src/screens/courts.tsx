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
import {COLORS} from '../constants/colors';
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
              <Image source={{uri: item.image}} style={styles.cardImage} />
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
    backgroundColor: '#fdf9f4',
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#222',
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
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
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
    color: '#222',
  },
  cardAddress: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  arrow: {
    fontSize: 28,
    color: '#d1d1d1',
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
    tintColor: '#c7d3d1',
  },
  emptyText: {
    fontSize: 20,
    color: COLORS.greyPrimary,
  },
});

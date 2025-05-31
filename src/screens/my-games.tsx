/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {courtsData} from '../data/courts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/main';
import {SearchInput} from '../components/search-input';
import {CalendarIcon} from '../assets/svg/calendar-icon';
import {ClockIcon} from '../assets/svg/clock-icon';
import {LocationIcon} from '../assets/svg/location-icon';

type MyGamesScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const GAMES_STORAGE_KEY = 'games_data';

const GAME_STATUSES = [
  'Scheduled',
  'Waiting for Players',
  'Completed',
  'Cancelled',
] as const;
type GameStatus = (typeof GAME_STATUSES)[number];

const STATUS_COLORS: {[key: string]: string} = {
  Scheduled: '#4DD0E1',
  'Waiting for Players': '#FFB74D',
  Completed: '#81C784',
  Cancelled: '#E57373',
};

const STATUS_BG_COLORS: {[key: string]: string} = {
  Scheduled: '#003F4E',
  'Waiting for Players': '#4E3A00',
  Completed: '#1B5E20',
  Cancelled: '#B71C1C',
};

type Game = {
  id: string;
  date: string;
  time: string;
  players: string[];
  status: GameStatus;
  courtId: string;
  notes?: string;
};

const GameCard = ({game}: {game: Game}) => {
  const court = courtsData.find(c => c.id === game.courtId);
  const navigation = useNavigation<MyGamesScreenNavigationProp>();

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('GameDetails', {gameId: game.id})}
        style={{flex: 1, gap: 16}}>
        <View style={styles.cardLeft}>
          <View style={styles.topRow}>
            <View style={styles.playersContainer}>
              <Text style={styles.playersLabel}>
                {game.players.length > 0 ? 'Players:' : ''}
              </Text>
              <View style={styles.playersList}>
                {game.players.map((player, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.playerName,
                      player === 'Available' && styles.availableSlot,
                    ]}>
                    {player}
                  </Text>
                ))}
              </View>
            </View>
            <View
              style={[
                styles.statusTag,
                {backgroundColor: STATUS_BG_COLORS[game.status] || '#2A2A2A'},
              ]}>
              <Text
                style={[
                  styles.statusText,
                  {color: STATUS_COLORS[game.status] || '#B0B0B0'},
                ]}>
                {game.status}
              </Text>
            </View>
          </View>

          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeContainer}>
              <CalendarIcon width={18} height={18} />
              <Text style={styles.dateTime}>{game.date}</Text>
            </View>
            <View style={styles.dateTimeContainer}>
              <ClockIcon width={18} height={18} />
              <Text style={styles.dateTime}>{game.time}</Text>
            </View>
          </View>

          <View style={styles.locationContainer}>
            <LocationIcon />
            <Text style={styles.courtName}>{court?.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const MyGamesScreen = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<MyGamesScreenNavigationProp>();

  console.log(games);

  useFocusEffect(() => {
    loadGames();
  });

  const loadGames = async () => {
    try {
      const storedGames = await AsyncStorage.getItem(GAMES_STORAGE_KEY);
      if (storedGames) {
        setGames(JSON.parse(storedGames));
      }
    } catch (error) {
      console.error('Error loading games:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredGames = games.filter(game => {
    // First filter out completed and cancelled games
    if (game.status === 'Completed' || game.status === 'Cancelled') {
      return false;
    }

    const searchLower = searchQuery.toLowerCase();
    const court = courtsData.find(c => c.id === game.courtId);

    return (
      game.players.some(player => player.toLowerCase().includes(searchLower)) ||
      game.date.toLowerCase().includes(searchLower) ||
      game.time.toLowerCase().includes(searchLower) ||
      court?.name.toLowerCase().includes(searchLower)
    );
  });

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No games scheduled yet</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Games</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateGame')}>
          <Text style={{fontSize: 28, color: '#4DD0E1'}}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <SearchInput placeholder="Search games..." onSearch={handleSearch} />
      </View>

      <FlatList
        data={filteredGames}
        keyExtractor={item => item.id}
        renderItem={({item}) => <GameCard game={item} />}
        contentContainerStyle={{paddingBottom: 32}}
        style={{flex: 1}}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 36,
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E0E0E0',
    textAlign: 'center',
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    right: 24,
    top: 18,
    backgroundColor: '#003F4E',
    borderRadius: 24,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#2A2A2A',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  cardContent: {},
  cardLeft: {
    flex: 1,
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  playersContainer: {
    flex: 1,
  },
  playersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  playersLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E0E0E0',
    marginBottom: 2,
  },
  playerName: {
    fontSize: 14,
    color: '#E0E0E0',
    backgroundColor: '#363636',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0E0E0',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  courtName: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  statusTag: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  availableSlot: {
    color: '#AAAAAA',
    backgroundColor: '#333333',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E0E0E0',
    marginTop: 24,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  deleteButtonText: {
    fontSize: 24,
    color: '#AAAAAA',
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
});

export default MyGamesScreen;

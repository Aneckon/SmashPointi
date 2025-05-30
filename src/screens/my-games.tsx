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

type MyGamesScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const GAMES_STORAGE_KEY = 'games_data';

const GAME_STATUSES = ['Scheduled', 'Waiting for Players'] as const;
type GameStatus = (typeof GAME_STATUSES)[number];

const STATUS_COLORS: {[key: string]: string} = {
  Scheduled: '#4DD0E1',
  'Waiting for Players': '#FFB74D',
};

const STATUS_BG_COLORS: {[key: string]: string} = {
  Scheduled: '#003F4E',
  'Waiting for Players': '#4E3A00',
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

const GameCard = ({
  game,
  onDelete,
}: {
  game: Game;
  onDelete: (id: string) => void;
}) => {
  const court = courtsData.find(c => c.id === game.courtId);
  const filledSpots = game.players.filter(
    player => player !== 'Available',
  ).length;
  const status = filledSpots === 3 ? 'Scheduled' : 'Waiting for Players';

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => onDelete(game.id)}
        style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <View style={styles.cardLeft}>
          <Text style={styles.dateTime}>
            {game.date} {game.time}
          </Text>
          <View style={styles.playersContainer}>
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
          <Text style={styles.courtName}>{court?.name}</Text>
        </View>
        <View
          style={[
            styles.statusTag,
            {backgroundColor: STATUS_BG_COLORS[status] || '#2A2A2A'},
          ]}>
          <Text
            style={[
              styles.statusText,
              {color: STATUS_COLORS[status] || '#B0B0B0'},
            ]}>
            {status}
          </Text>
        </View>
      </View>
    </View>
  );
};

const MyGamesScreen = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<MyGamesScreenNavigationProp>();

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

  const handleDeleteGame = async (gameId: string) => {
    try {
      const updatedGames = games.filter(game => game.id !== gameId);
      await AsyncStorage.setItem(
        GAMES_STORAGE_KEY,
        JSON.stringify(updatedGames),
      );
      setGames(updatedGames);
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredGames = games.filter(game => {
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
        renderItem={({item}) => (
          <GameCard game={item} onDelete={handleDeleteGame} />
        )}
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
  cardContent: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    gap: 10,
    flex: 1,
  },
  dateTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0E0E0',
  },
  playersContainer: {
    marginTop: 4,
    flexDirection: 'column',
    gap: 4,
  },
  playerName: {
    fontSize: 14,
    color: '#E0E0E0',
    backgroundColor: '#363636',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  availableSlot: {
    color: '#AAAAAA',
    backgroundColor: '#333333',
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
  courtName: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 4,
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

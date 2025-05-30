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

type MyGamesScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const GAMES_STORAGE_KEY = 'games_data';

const GAME_STATUSES = ['Scheduled', 'Waiting for Players'] as const;
type GameStatus = (typeof GAME_STATUSES)[number];

const STATUS_COLORS: {[key: string]: string} = {
  Scheduled: '#B6E6E0',
  'Waiting for Players': '#FFE6B6',
};

const STATUS_TEXT_COLORS: {[key: string]: string} = {
  Scheduled: '#21706A',
  'Waiting for Players': '#A37B00',
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
      <View
        style={{
          gap: 10,
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            gap: 10,
            flex: 1,
          }}>
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
            {backgroundColor: STATUS_COLORS[status] || '#E0E3E6'},
          ]}>
          <Text
            style={[
              styles.statusText,
              {color: STATUS_TEXT_COLORS[status] || '#6B6B6B'},
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
          <Text style={{fontSize: 28, color: '#21706A'}}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={games}
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
    backgroundColor: '#fdf9f4',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    right: 24,
    top: 18,
    backgroundColor: '#E6F4F1',
    borderRadius: 24,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  dateTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  playersContainer: {
    marginTop: 4,
    flexDirection: 'column',
    gap: 4,
  },
  playerName: {
    fontSize: 14,
    color: '#222',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  availableSlot: {
    color: '#6B6B6B',
    backgroundColor: '#F0F0F0',
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
    color: '#222',
    marginTop: 24,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6B6B6B',
    marginTop: 8,
  },
  courtName: {
    fontSize: 14,
    color: '#6B6B6B',
    marginTop: 4,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  deleteButtonText: {
    fontSize: 24,
    color: '#6B6B6B',
    fontWeight: '600',
  },
});

export default MyGamesScreen;

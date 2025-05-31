import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {IMAGES} from '../constants/images';
import {ArrowLeftIcon} from '../assets/svg/arrow-left-icon';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GAMES_STORAGE_KEY = 'games_data';

type GameStatus = 'Completed' | 'Cancelled' | 'Waiting for Players';
type GameResult = 'Win' | 'Loss';

type Game = {
  id: string;
  date: string;
  time: string;
  status: GameStatus;
  result?: GameResult;
  score?: string;
  players: string[];
  courtId: string;
  fullDate: string;
  duration?: number;
  points?: number;
  notes?: string;
  shots?: {
    smash: number;
    volley: number;
    bandeja: number;
    lob: number;
  };
};

const ResultChip = ({
  status,
  result,
}: {
  status: GameStatus;
  result?: GameResult;
}) => {
  const getChipStyle = () => {
    if (status === 'Cancelled') {
      return styles.canceledChip;
    }

    switch (result?.toLowerCase()) {
      case 'win':
        return styles.wonChip;
      case 'loss':
        return styles.lostChip;
      default:
        return {};
    }
  };

  const getChipText = () => {
    if (status === 'Cancelled') {
      return 'Cancelled';
    }
    return result || 'Unknown';
  };

  return (
    <View style={[styles.chip, getChipStyle()]}>
      <Text style={styles.chipText}>{getChipText()}</Text>
    </View>
  );
};

const GameItem = ({game}: {game: Game}) => (
  <View style={styles.gameItem}>
    <View style={styles.gameHeader}>
      <Text style={styles.date}>
        {game.date} {game.time}
      </Text>
      <ResultChip status={game.status} result={game.result} />
    </View>
    {game.players.length > 0 && (
      <Text style={styles.opponents}>{`vs. ${game.players?.join(' & ')}`}</Text>
    )}
    {game.score && <Text style={styles.score}>{game.score}</Text>}
  </View>
);

const EmptyState = () => (
  <View style={styles.emptyState}>
    <Image
      source={IMAGES.noCourts}
      style={styles.emptyImage}
      resizeMode="contain"
    />
    <Text style={styles.emptyStateText}>No games played yet</Text>
  </View>
);

export const HistoryScreen = () => {
  const navigation = useNavigation();
  const [games, setGames] = useState<Game[]>([]);

  console.log(games);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const storedGames = await AsyncStorage.getItem(GAMES_STORAGE_KEY);
        if (storedGames) {
          const parsedGames = JSON.parse(storedGames);
          // Filter games to show only Completed or Cancelled status
          const validGames = Array.isArray(parsedGames)
            ? parsedGames.filter(
                game =>
                  game &&
                  typeof game === 'object' &&
                  'id' in game &&
                  (game.status === 'Completed' || game.status === 'Cancelled'),
              )
            : [];
          setGames(validGames);
        }
      } catch (error) {
        console.error('Error loading games:', error);
        setGames([]);
      }
    };

    loadGames();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeftIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Game History</Text>
      </View>
      <FlatList
        data={games}
        renderItem={({item}) => <GameItem game={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={EmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#e2e8f0',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  gameItem: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#94a3b8',
  },
  opponents: {
    fontSize: 18,
    fontWeight: '500',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  score: {
    fontSize: 16,
    color: '#94a3b8',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E0E0E0',
  },
  wonChip: {
    backgroundColor: '#21706A',
  },
  lostChip: {
    backgroundColor: '#EF4444',
  },
  canceledChip: {
    backgroundColor: '#64748B',
  },
  drawChip: {
    backgroundColor: '#F59E0B',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#94a3b8',
    marginTop: 16,
  },
  emptyImage: {
    width: 220,
    height: 180,
    tintColor: '#4a4a4a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 22,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#e2e8f0',
  },
});

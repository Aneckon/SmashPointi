import React from 'react';
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
import {GAME_HISTORY, Game, GameResult} from '../data/history';

const ResultChip = ({result}: {result: GameResult}) => {
  const getChipStyle = () => {
    switch (result.toLowerCase()) {
      case 'won':
        return styles.wonChip;
      case 'lost':
        return styles.lostChip;
      case 'canceled':
        return styles.canceledChip;
      default:
        return {};
    }
  };

  return (
    <View style={[styles.chip, getChipStyle()]}>
      <Text style={styles.chipText}>{result}</Text>
    </View>
  );
};

const GameItem = ({game}: {game: Game}) => (
  <View style={styles.gameItem}>
    <View style={styles.gameHeader}>
      <Text style={styles.date}>{game.date}</Text>
      <ResultChip result={game.result} />
    </View>
    <Text style={styles.opponents}>vs. {game.opponents.join(' & ')}</Text>
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
        data={GAME_HISTORY}
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
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  wonChip: {
    backgroundColor: '#22c55e',
  },
  lostChip: {
    backgroundColor: '#ef4444',
  },
  canceledChip: {
    backgroundColor: '#64748b',
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

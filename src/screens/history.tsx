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
import {COLORS} from '../constants/colors';
import {useNavigation} from '@react-navigation/native';

const mockGames = [
  {
    id: '1',
    date: 'May 27, 2025',
    opponents: 'Carlos & Diego',
    result: 'Won',
    score: '6-4, 3-6, 7-5',
  },
  {
    id: '2',
    date: 'May 25, 2025',
    opponents: 'Maria & Ana',
    result: 'Lost',
    score: '4-6, 2-6',
  },
  {
    id: '3',
    date: 'May 20, 2025',
    opponents: 'Juan & Pedro',
    result: 'Canceled',
    score: null,
  },
];

const ResultChip = ({result}: {result: string}) => {
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

const GameItem = ({game}: {game: (typeof mockGames)[0]}) => (
  <View style={styles.gameItem}>
    <View style={styles.gameHeader}>
      <Text style={styles.date}>{game.date}</Text>
      <ResultChip result={game.result} />
    </View>
    <Text style={styles.opponents}>vs. {game.opponents}</Text>
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
        data={mockGames}
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
    backgroundColor: '#fdf9f4',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  gameItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#64748b',
  },
  opponents: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 4,
  },
  score: {
    fontSize: 16,
    color: '#64748b',
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
    backgroundColor: '#94a3b8',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#64748b',
    marginTop: 16,
  },
  emptyImage: {
    width: 220,
    height: 180,
    tintColor: '#c7d3d1',
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
    color: COLORS.black,
  },
});

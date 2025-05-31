import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from '../components/button';
import {ArrowRightIcon} from '../assets/svg/arrow-right-icon';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/main';
import {Announcement, ANNOUNCEMENTS} from '../data/announcement';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {skillLevels} from '../data/levels';
import {courtsData} from '../data/courts';
import {CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {TabParamList} from '../navigation/tabs';
import {parse} from 'date-fns';

const PROFILE_STORAGE_KEY = 'user_profile';
const GAMES_STORAGE_KEY = 'games_data';

type Game = {
  id: string;
  date: string;
  time: string;
  players: string[];
  status: string;
  courtId: string;
  notes?: string;
  result?: 'Win' | 'Loss';
  score?: string;
  points?: number;
  duration?: number;
  shots?: {
    smash: number;
    volley: number;
    bandeja: number;
    lob: number;
  };
};

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  BottomTabNavigationProp<TabParamList>
>;

const calculateStatsFromGames = (games: Game[]) => {
  const completedGames = games.filter(game => game.status === 'Completed');
  const wonGames = games.filter(game => game.result === 'Win');

  const totalPoints = completedGames.reduce(
    (sum, game) => sum + (game.points || 0),
    0,
  );

  const shotCounts = completedGames.reduce(
    (acc, game) => {
      if (game.shots) {
        acc.smash += game.shots.smash;
        acc.volley += game.shots.volley;
        acc.bandeja += game.shots.bandeja;
        acc.lob += game.shots.lob;
      }
      return acc;
    },
    {smash: 0, volley: 0, bandeja: 0, lob: 0},
  );

  const favoriteShot = Object.entries(shotCounts).reduce((a, b) =>
    a[1] > b[1] ? a : b,
  )[0];

  const calculateBestStreak = (gameList: Game[]) => {
    let currentStreak = 0;
    let bestStreak = 0;

    gameList.forEach(game => {
      if (game.result === 'Win') {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else if (game.result === 'Loss') {
        currentStreak = 0;
      }
    });

    return bestStreak;
  };

  return {
    matchesPlayed: completedGames.length,
    winRate:
      completedGames.length > 0
        ? `${Math.round((wonGames.length / completedGames.length) * 100)}%`
        : '0%',
    averagePoints:
      completedGames.length > 0
        ? (totalPoints / completedGames.length).toFixed(1)
        : '0',
    bestStreak: calculateBestStreak(games),
    totalGames: games.length,
    favoriteShot: favoriteShot
      ? favoriteShot.charAt(0).toUpperCase() + favoriteShot.slice(1)
      : 'None',
  };
};

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [user, setUser] = useState({
    name: '',
    level: '',
    stats: {
      matchesPlayed: 0,
      winRate: '0%',
      averagePoints: '0',
      bestStreak: 0,
      totalGames: 0,
      favoriteShot: 'None',
    },
  });
  const [nextGame, setNextGame] = useState<Game | null>(null);
  const [timeUntilGame, setTimeUntilGame] = useState<string>('');

  const updateCountdown = useCallback(() => {
    if (!nextGame) {
      return;
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const gameDate = parse(
      `${nextGame.date} ${currentYear}`,
      'EEE, dd MMM yyyy',
      new Date(),
    );
    const [gameHours, gameMinutes] = nextGame.time.split(':').map(Number);
    gameDate.setHours(gameHours, gameMinutes);

    const diff = gameDate.getTime() - now.getTime();

    if (diff <= 0) {
      setTimeUntilGame('Game in progress');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    let countdownText = '';
    if (days > 0) {
      countdownText += `${days}d `;
    }
    if (remainingHours > 0 || days > 0) {
      countdownText += `${remainingHours}h `;
    }
    if (mins > 0 || remainingHours > 0 || days > 0) {
      countdownText += `${mins}m `;
    }
    countdownText += `${secs}s`;

    setTimeUntilGame(countdownText);
  }, [nextGame]);

  useEffect(() => {
    if (nextGame) {
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    } else {
      setTimeUntilGame('');
    }
  }, [nextGame, updateCountdown]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const savedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
          if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            setUser(prevUser => ({
              ...prevUser,
              name: profile.name || '',
              level: profile.skillLevel || '',
            }));
          }

          const storedGames = await AsyncStorage.getItem(GAMES_STORAGE_KEY);
          if (storedGames) {
            const games: Game[] = JSON.parse(storedGames);
            const now = new Date();
            const currentYear = now.getFullYear();

            // Calculate stats from stored games
            setUser(prevUser => ({
              ...prevUser,
              stats: calculateStatsFromGames(games),
            }));

            const upcomingGame = games
              .filter(game => {
                const gameDate = parse(
                  `${game.date} ${currentYear}`,
                  'EEE, dd MMM yyyy',
                  new Date(),
                );
                const [hours, minutes] = game.time.split(':').map(Number);
                gameDate.setHours(hours, minutes);
                return (
                  gameDate > now &&
                  (game.status === 'Waiting for Players' ||
                    game.status === 'Scheduled')
                );
              })
              .sort((a, b) => {
                const dateA = parse(
                  `${a.date} ${currentYear}`,
                  'EEE, dd MMM yyyy',
                  new Date(),
                );
                const [hoursA, minutesA] = a.time.split(':').map(Number);
                dateA.setHours(hoursA, minutesA);

                const dateB = parse(
                  `${b.date} ${currentYear}`,
                  'EEE, dd MMM yyyy',
                  new Date(),
                );
                const [hoursB, minutesB] = b.time.split(':').map(Number);
                dateB.setHours(hoursB, minutesB);

                return dateA.getTime() - dateB.getTime();
              })[0];

            setNextGame(upcomingGame || null);
          }
        } catch (error) {
          console.error('Failed to load data from storage', error);
        }
      };

      loadData();
    }, []),
  );

  const handleAnnouncementPress = (announcement: Announcement) => {
    navigation.navigate('AnnouncementDetails', {announcement});
  };

  const handleNextGamePress = () => {
    if (nextGame) {
      navigation.navigate('GameDetails', {gameId: nextGame.id});
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Welcome{user.name ? `, ${user.name}` : ''} 👋
          </Text>
          <View style={styles.userStats}>
            <Text style={styles.userLevel}>
              {user.level
                ? skillLevels.find(l => l.value === user.level)?.label ||
                  user.level
                : 'No level set'}
            </Text>
          </View>
        </View>

        <View style={styles.announcementsSection}>
          <Text style={styles.sectionTitle}>Club Announcements</Text>
          {ANNOUNCEMENTS.map(announcement => (
            <TouchableOpacity
              key={announcement.id}
              style={styles.announcementCard}
              onPress={() => handleAnnouncementPress(announcement)}
              activeOpacity={0.7}>
              <Image
                source={announcement.image}
                style={styles.announcementImage}
              />
              <View style={styles.announcementContent}>
                <Text style={styles.announcementTitle}>
                  {announcement.title}
                </Text>
                <Text style={styles.announcementDate}>{announcement.date}</Text>
              </View>
              <ArrowRightIcon />
            </TouchableOpacity>
          ))}
        </View>

        {nextGame ? (
          <View style={styles.nextGameCard}>
            <Text style={styles.nextGameTitle}>Next Game</Text>
            <TouchableOpacity
              style={styles.gameInfo}
              onPress={handleNextGamePress}>
              <Text style={styles.gameDateTime}>
                {nextGame.date} at {nextGame.time}
              </Text>
              <Text style={styles.courtName}>
                {courtsData.find(c => c.id === nextGame.courtId)?.name}
              </Text>
              <Text style={styles.opponents}>
                {nextGame.players.length > 0
                  ? `vs. ${nextGame.players.join(' & ')}`
                  : 'Waiting for players'}
              </Text>
              <View style={styles.countdownContainer}>
                <Text style={styles.countdown}>{timeUntilGame}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.nextGameCard}>
            <Text style={styles.nextGameTitle}>No Upcoming Games</Text>
            <Button
              title="Schedule Game"
              onPress={() => navigation.navigate('CreateGame')}
              height={44}
            />
          </View>
        )}

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{user.stats.matchesPlayed}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{user.stats.winRate}</Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{user.stats.averagePoints}</Text>
              <Text style={styles.statLabel}>Avg Points</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{user.stats.bestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{user.stats.totalGames}</Text>
              <Text style={styles.statLabel}>Total Games</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{user.stats.favoriteShot}</Text>
              <Text style={styles.statLabel}>Best Shot</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E0E0E0',
    marginBottom: 8,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userLevel: {
    fontSize: 16,
    color: '#4EC6B7',
    fontWeight: '600',
  },
  userRating: {
    fontSize: 16,
    color: '#AAAAAA',
    marginLeft: 8,
  },
  bannerContainer: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bannerOverlayContent: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bannerSubtext: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  nextGameCard: {
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  nextGameTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E0E0E0',
    marginBottom: 16,
  },
  gameInfo: {
    marginBottom: 20,
    backgroundColor: '#363636',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gameDateTime: {
    fontSize: 18,
    color: '#E0E0E0',
    marginBottom: 12,
    fontWeight: '600',
  },
  courtName: {
    fontSize: 16,
    color: '#4EC6B7',
    marginBottom: 12,
    fontWeight: '500',
  },
  opponents: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 8,
    fontWeight: '500',
  },
  countdownContainer: {
    backgroundColor: '#4EC6B7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  countdown: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statsContent: {
    gap: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E0E0E0',
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  announcementsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E0E0E0',
    marginBottom: 16,
  },
  announcementCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  announcementImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  announcementContent: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 4,
    fontWeight: '500',
  },
  announcementDate: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  statCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4EC6B7',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#AAAAAA',
    textAlign: 'center',
  },
  noGamesText: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
});

import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/main';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {courtsData} from '../data/courts';
import {ArrowLeftIcon} from '../assets/svg/arrow-left-icon';
import {Button} from '../components/button';
import {CalendarIcon} from '../assets/svg/calendar-icon';
import {ClockIcon} from '../assets/svg/clock-icon';
import {Svg, Path} from 'react-native-svg';
import {COLORS} from '../constants/colors';

const GAMES_STORAGE_KEY = 'games_data';

type GameStatus =
  | 'Scheduled'
  | 'Waiting for Players'
  | 'Completed'
  | 'Cancelled';

type Game = {
  id: string;
  date: string;
  time: string;
  players: string[];
  status: GameStatus;
  courtId: string;
  notes?: string;
  // History related fields
  result?: 'Win' | 'Loss';
  score?: string;
  points?: number;
  duration?: number; // in minutes
  shots?: {
    smash: number;
    volley: number;
    bandeja: number;
    lob: number;
  };
};

type GameDetailsScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export const GameDetailsScreen = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [editedGame, setEditedGame] = useState<Game | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCourtDropdown, setShowCourtDropdown] = useState(false);
  const [showResultDropdown, setShowResultDropdown] = useState(false);
  const [courtSearch, setCourtSearch] = useState('');
  const [newPlayer, setNewPlayer] = useState('');
  const navigation = useNavigation<GameDetailsScreenNavigationProp>();
  const route = useRoute();
  const {gameId} = route.params as {gameId: string};

  const gameStatuses: GameStatus[] = [
    'Scheduled',
    'Waiting for Players',
    'Completed',
    'Cancelled',
  ];
  const resultOptions = ['Win', 'Loss'];
  const filteredCourts = courtsData.filter(c =>
    c.name.toLowerCase().includes(courtSearch.toLowerCase()),
  );

  const loadGame = useCallback(async () => {
    try {
      const storedGames = await AsyncStorage.getItem(GAMES_STORAGE_KEY);
      if (storedGames) {
        const games = JSON.parse(storedGames);
        const foundGame = games.find((g: Game) => g.id === gameId);
        if (foundGame) {
          setGame(foundGame);
          setEditedGame(foundGame);
        }
      }
    } catch (error) {
      console.error('Error loading game:', error);
    }
  }, [gameId]);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  const handleSave = async () => {
    if (!editedGame) {
      return;
    }

    Alert.alert(
      'Save Changes',
      'Are you sure you want to save these changes?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: async () => {
            try {
              const storedGames = await AsyncStorage.getItem(GAMES_STORAGE_KEY);
              if (storedGames) {
                const games = JSON.parse(storedGames);
                const updatedGames = games.map((g: Game) =>
                  g.id === gameId ? editedGame : g,
                );
                await AsyncStorage.setItem(
                  GAMES_STORAGE_KEY,
                  JSON.stringify(updatedGames),
                );
                setGame(editedGame);
                navigation.goBack();
              }
            } catch (error) {
              console.error('Error saving game:', error);
            }
          },
        },
      ],
    );
  };

  const handleDelete = async () => {
    Alert.alert('Delete Game', 'Are you sure you want to delete this game?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const storedGames = await AsyncStorage.getItem(GAMES_STORAGE_KEY);
            if (storedGames) {
              const games = JSON.parse(storedGames);
              const updatedGames = games.filter((g: Game) => g.id !== gameId);
              await AsyncStorage.setItem(
                GAMES_STORAGE_KEY,
                JSON.stringify(updatedGames),
              );
              navigation.goBack();
            }
          } catch (error) {
            console.error('Error deleting game:', error);
          }
        },
      },
    ]);
  };

  const handleAddPlayer = () => {
    const trimmedPlayer = newPlayer.trim();
    if (trimmedPlayer && !editedGame?.players.includes(trimmedPlayer)) {
      if (editedGame && editedGame.players.length >= 3) {
        Alert.alert(
          'Maximum Players Reached',
          'You can only add up to 3 players.',
        );
        return;
      }
      setEditedGame({
        ...editedGame!,
        players: [...editedGame!.players, trimmedPlayer],
      });
      setNewPlayer('');
    }
  };

  const handleRemovePlayer = (name: string) => {
    if (editedGame) {
      setEditedGame({
        ...editedGame,
        players: editedGame.players.filter(player => player !== name),
      });
    }
  };

  const initializeShots = () => {
    if (editedGame) {
      setEditedGame({
        ...editedGame,
        shots: {
          smash: 0,
          volley: 0,
          bandeja: 0,
          lob: 0,
        },
      });
    }
  };

  if (!game || !editedGame) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowLeftIcon width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Game</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.loadingText}>Loading game details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const court = courtsData.find(c => c.id === editedGame.courtId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeftIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Game</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <TouchableOpacity
            style={styles.inputRow}
            onPress={() => setShowStatusDropdown(!showStatusDropdown)}
            activeOpacity={0.8}>
            <Svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              style={{marginRight: 12}}>
              <Path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="#21706A"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </Svg>
            <Text style={[styles.input, {color: '#E0E0E0'}]}>
              {editedGame.status}
            </Text>
            <Svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              style={{marginLeft: 'auto'}}>
              <Path
                d="M6 8l4 4 4-4"
                stroke="#21706A"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </Svg>
          </TouchableOpacity>
          {showStatusDropdown && (
            <View style={styles.dropdown}>
              {gameStatuses.map(status => (
                <TouchableOpacity
                  key={status}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setEditedGame({...editedGame, status});
                    setShowStatusDropdown(false);
                  }}>
                  <Text style={styles.dropdownText}>{status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.inputRow}>
            <CalendarIcon style={{marginRight: 12}} />
            <TextInput
              style={styles.input}
              value={editedGame.date}
              onChangeText={text => setEditedGame({...editedGame, date: text})}
              placeholder="Date"
              placeholderTextColor={COLORS.greyPrimary}
            />
          </View>

          <View style={styles.inputRow}>
            <ClockIcon style={{marginRight: 12}} />
            <TextInput
              style={styles.input}
              value={editedGame.time}
              onChangeText={text => setEditedGame({...editedGame, time: text})}
              placeholder="Time"
              placeholderTextColor={COLORS.greyPrimary}
            />
          </View>

          <TouchableOpacity
            style={styles.inputRow}
            onPress={() => setShowCourtDropdown(!showCourtDropdown)}
            activeOpacity={0.8}>
            <Svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              style={{marginRight: 12}}>
              <Path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="#21706A"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </Svg>
            <Text style={[styles.input, {color: '#E0E0E0'}]}>
              {court ? court.name : 'Select Court'}
            </Text>
            <Svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              style={{marginLeft: 'auto'}}>
              <Path
                d="M6 8l4 4 4-4"
                stroke="#21706A"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </Svg>
          </TouchableOpacity>
          {showCourtDropdown && (
            <View style={styles.dropdown}>
              <TextInput
                style={[styles.input, {marginBottom: 8}]}
                placeholder="Search courts..."
                value={courtSearch}
                onChangeText={setCourtSearch}
                placeholderTextColor={COLORS.greyPrimary}
              />
              {filteredCourts.map(c => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setEditedGame({...editedGame, courtId: c.id});
                    setShowCourtDropdown(false);
                    setCourtSearch('');
                  }}>
                  <Text style={styles.dropdownText}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Players</Text>
            <View style={styles.inputRow}>
              <Svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                style={{marginRight: 12}}>
                <Path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  stroke="#21706A"
                  strokeWidth={1.5}
                />
              </Svg>
              <TextInput
                style={styles.input}
                placeholder={
                  editedGame.players.length >= 3
                    ? 'Maximum players reached'
                    : 'Enter player name'
                }
                value={newPlayer}
                onChangeText={setNewPlayer}
                placeholderTextColor={COLORS.greyPrimary}
                onSubmitEditing={handleAddPlayer}
                returnKeyType="done"
                editable={editedGame.players.length < 3}
              />
              <TouchableOpacity
                onPress={handleAddPlayer}
                style={[
                  styles.addButton,
                  editedGame.players.length >= 3 && styles.addButtonDisabled,
                ]}
                disabled={editedGame.players.length >= 3}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            {editedGame.players.length > 0 && (
              <View style={styles.opponentList}>
                {editedGame.players.map((name, index) => (
                  <View key={index} style={styles.opponentItem}>
                    <Text style={styles.opponentName}>{name}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemovePlayer(name)}
                      style={styles.removeButton}>
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View
              style={[
                styles.inputRow,
                {alignItems: 'flex-start', minHeight: 80},
              ]}>
              <TextInput
                style={[styles.input, {height: 80, textAlignVertical: 'top'}]}
                value={editedGame.notes}
                onChangeText={text =>
                  setEditedGame({...editedGame, notes: text})
                }
                placeholder="Add notes..."
                placeholderTextColor={COLORS.greyPrimary}
                multiline
              />
            </View>
          </View>

          {editedGame.status === 'Completed' && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Result</Text>
                <TouchableOpacity
                  style={styles.inputRow}
                  onPress={() => setShowResultDropdown(!showResultDropdown)}
                  activeOpacity={0.8}>
                  <Svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{marginRight: 12}}>
                    <Path
                      d="M4 6h16M4 12h16M4 18h16"
                      stroke="#21706A"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  </Svg>
                  <Text style={[styles.input, {color: '#E0E0E0'}]}>
                    {editedGame.result || 'Select Result'}
                  </Text>
                  <Svg
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                    style={{marginLeft: 'auto'}}>
                    <Path
                      d="M6 8l4 4 4-4"
                      stroke="#21706A"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  </Svg>
                </TouchableOpacity>
                {showResultDropdown && (
                  <View style={styles.dropdown}>
                    {resultOptions.map(result => (
                      <TouchableOpacity
                        key={result}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setEditedGame({
                            ...editedGame,
                            result: result as 'Win' | 'Loss',
                          });
                          setShowResultDropdown(false);
                        }}>
                        <Text style={styles.dropdownText}>{result}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={editedGame.score}
                    onChangeText={text =>
                      setEditedGame({...editedGame, score: text})
                    }
                    placeholder="Score (e.g., 6-4, 3-6, 7-5)"
                    placeholderTextColor={COLORS.greyPrimary}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Stats</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={editedGame.duration?.toString()}
                    onChangeText={text =>
                      setEditedGame({
                        ...editedGame,
                        duration: parseInt(text) || 0,
                      })
                    }
                    placeholder="Duration (minutes)"
                    placeholderTextColor={COLORS.greyPrimary}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={editedGame.points?.toString()}
                    onChangeText={text =>
                      setEditedGame({
                        ...editedGame,
                        points: parseInt(text) || 0,
                      })
                    }
                    placeholder="Points"
                    placeholderTextColor={COLORS.greyPrimary}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.shotsSection}>
                  <View style={styles.shotsHeader}>
                    <Text style={styles.sectionTitle}>Shots</Text>
                    {!editedGame.shots && (
                      <TouchableOpacity
                        style={styles.addShotsButton}
                        onPress={initializeShots}>
                        <Text style={styles.addShotsButtonText}>Add Shots</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {editedGame.shots && (
                    <View style={styles.shotsGrid}>
                      <View style={styles.shotItem}>
                        <Text style={styles.shotLabel}>Smash</Text>
                        <TextInput
                          style={styles.shotInput}
                          value={editedGame.shots.smash.toString()}
                          onChangeText={text => {
                            const value = parseInt(text) || 0;
                            setEditedGame({
                              ...editedGame,
                              shots: {
                                ...editedGame.shots!,
                                smash: Math.max(0, value),
                              },
                            });
                          }}
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor={COLORS.greyPrimary}
                        />
                      </View>

                      <View style={styles.shotItem}>
                        <Text style={styles.shotLabel}>Volley</Text>
                        <TextInput
                          style={styles.shotInput}
                          value={editedGame.shots.volley.toString()}
                          onChangeText={text => {
                            const value = parseInt(text) || 0;
                            setEditedGame({
                              ...editedGame,
                              shots: {
                                ...editedGame.shots!,
                                volley: Math.max(0, value),
                              },
                            });
                          }}
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor={COLORS.greyPrimary}
                        />
                      </View>

                      <View style={styles.shotItem}>
                        <Text style={styles.shotLabel}>Bandeja</Text>
                        <TextInput
                          style={styles.shotInput}
                          value={editedGame.shots.bandeja.toString()}
                          onChangeText={text => {
                            const value = parseInt(text) || 0;
                            setEditedGame({
                              ...editedGame,
                              shots: {
                                ...editedGame.shots!,
                                bandeja: Math.max(0, value),
                              },
                            });
                          }}
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor={COLORS.greyPrimary}
                        />
                      </View>

                      <View style={styles.shotItem}>
                        <Text style={styles.shotLabel}>Lob</Text>
                        <TextInput
                          style={styles.shotInput}
                          value={editedGame.shots.lob.toString()}
                          onChangeText={text => {
                            const value = parseInt(text) || 0;
                            setEditedGame({
                              ...editedGame,
                              shots: {
                                ...editedGame.shots!,
                                lob: Math.max(0, value),
                              },
                            });
                          }}
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor={COLORS.greyPrimary}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button title="Save Changes" onPress={handleSave} height={44} />
        <Button
          title="Delete Game"
          onPress={handleDelete}
          height={44}
          secondary
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#E0E0E0',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  form: {
    gap: 18,
    marginBottom: 32,
  },
  loadingText: {
    color: '#E0E0E0',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4DD0E1',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#E0E0E0',
    backgroundColor: 'transparent',
  },
  dropdown: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    marginTop: -8,
    marginBottom: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#363636',
  },
  dropdownText: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  shotsSection: {
    marginTop: 16,
  },
  shotsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addShotsButton: {
    backgroundColor: '#21706A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addShotsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  shotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
  },
  shotItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 12,
  },
  shotLabel: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 8,
    textAlign: 'center',
  },
  shotInput: {
    backgroundColor: '#363636',
    borderRadius: 8,
    padding: 8,
    color: '#E0E0E0',
    fontSize: 16,
    textAlign: 'center',
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  addButton: {
    backgroundColor: '#21706A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#363636',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  opponentList: {
    gap: 8,
  },
  opponentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  opponentName: {
    flex: 1,
    fontSize: 16,
    color: '#E0E0E0',
  },
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    fontSize: 20,
    color: '#AAAAAA',
    fontWeight: '600',
  },
});

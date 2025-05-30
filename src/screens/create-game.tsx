import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DateInput} from '../components/date-input';
import {Button} from '../components/button';
import {SearchInput} from '../components/search-input';
import {courtsData} from '../data/courts';
import {ClockIcon} from '../assets/svg/clock-icon';
import {COLORS} from '../constants/colors';
import {Svg, Path} from 'react-native-svg';
import {CalendarIcon} from '../assets/svg/calendar-icon';
import {ArrowLeftIcon} from '../assets/svg/arrow-left-icon';
import {useNavigation} from '@react-navigation/native';

const GAMES_STORAGE_KEY = 'games_data';

export const CreateGameScreen = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [opponents, setOpponents] = useState('');
  const [opponentList, setOpponentList] = useState<string[]>([]);
  const [court, setCourt] = useState<any>(null);
  const [courtSearch, setCourtSearch] = useState('');
  const [notes, setNotes] = useState('');
  const [showCourtDropdown, setShowCourtDropdown] = useState(false);
  const navigation = useNavigation();

  const filteredCourts = courtsData.filter(c =>
    c.name.toLowerCase().includes(courtSearch.toLowerCase()),
  );

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleCourtSelect = (court: any) => {
    setCourt(court);
    setShowCourtDropdown(false);
    setCourtSearch('');
  };

  const handleAddOpponent = () => {
    const trimmedOpponent = opponents.trim();
    if (trimmedOpponent && !opponentList.includes(trimmedOpponent)) {
      if (opponentList.length >= 3) {
        Alert.alert(
          'Maximum Players Reached',
          'You can only add up to 3 players.',
        );
        return;
      }
      setOpponentList([...opponentList, trimmedOpponent]);
      setOpponents('');
    }
  };

  const handleRemoveOpponent = (name: string) => {
    setOpponentList(opponentList.filter(opponent => opponent !== name));
  };

  const handleAddGame = async () => {
    if (!date || !time || !court) {
      Alert.alert('Please fill in all required fields.');
      return;
    }
    try {
      const filledSpots = opponentList.filter(
        player => player !== 'Available',
      ).length;
      const status = filledSpots === 3 ? 'Scheduled' : 'Waiting for Players';

      const newGame = {
        id: Date.now().toString(),
        date: date.toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        fullDate: date.toISOString(),
        time: time.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        }),
        players: opponentList,
        status,
        courtId: court.id,
        notes,
      };
      const stored = await AsyncStorage.getItem(GAMES_STORAGE_KEY);
      const games = stored ? JSON.parse(stored) : [];
      games.push(newGame);
      await AsyncStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(games));
      Alert.alert('Game added!');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Could not save game.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeftIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Game</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <TouchableOpacity
            style={styles.inputRow}
            onPress={() => {}}
            activeOpacity={1}>
            <CalendarIcon style={{marginRight: 12}} />
            <DateInput
              value={date}
              onChange={setDate}
              placeholder="Select Date"
            />
          </TouchableOpacity>

          <View style={styles.inputRow}>
            <ClockIcon style={{marginRight: 12}} />
            <DateInput
              value={time}
              onChange={setTime}
              mode="time"
              placeholder="Select Time"
            />
          </View>

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
                opponentList.length >= 3
                  ? 'Maximum players reached'
                  : 'Enter opponent/team names'
              }
              value={opponents}
              onChangeText={setOpponents}
              placeholderTextColor={COLORS.greyPrimary}
              onSubmitEditing={handleAddOpponent}
              returnKeyType="done"
              editable={opponentList.length < 3}
            />
            <TouchableOpacity
              onPress={handleAddOpponent}
              style={[
                styles.addButton,
                opponentList.length >= 3 && styles.addButtonDisabled,
              ]}
              disabled={opponentList.length >= 3}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {opponentList.length > 0 && (
            <View style={styles.opponentList}>
              {opponentList.map((name, index) => (
                <View key={index} style={styles.opponentItem}>
                  <Text style={styles.opponentName}>{name}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveOpponent(name)}
                    style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

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
              <SearchInput
                placeholder="Search courts..."
                onSearch={setCourtSearch}
              />
              {filteredCourts.map(c => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.dropdownItem}
                  onPress={() => handleCourtSelect(c)}>
                  <Text style={styles.dropdownText}>{c.name}</Text>
                </TouchableOpacity>
              ))}
              {filteredCourts.length === 0 && (
                <Text style={styles.dropdownText}>No courts found</Text>
              )}
            </View>
          )}

          <View
            style={[
              styles.inputRow,
              {alignItems: 'flex-start', minHeight: 80},
            ]}>
            <TextInput
              style={[styles.input, {height: 80, textAlignVertical: 'top'}]}
              placeholder="Notes (Optional)"
              value={notes}
              onChangeText={setNotes}
              placeholderTextColor={COLORS.greyPrimary}
              multiline
            />
          </View>
        </View>
        <Button title="Add Game" onPress={handleAddGame} height={56} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    color: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    gap: 18,
    marginBottom: 32,
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
  addButton: {
    backgroundColor: '#21706A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
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
  addButtonDisabled: {
    backgroundColor: '#363636',
  },
});

export default CreateGameScreen;

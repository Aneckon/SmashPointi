import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftIcon} from '../assets/svg/arrow-left-icon';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/main';
import {Button} from '../components/button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REGISTRATION_KEY = 'announcement_registrations';

export const AnnouncementDetailsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {announcement} =
    useRoute<RouteProp<RootStackParamList, 'AnnouncementDetails'>>().params;

  const [isRegistered, setIsRegistered] = useState(false);

  const checkRegistrationStatus = useCallback(async () => {
    try {
      const registrations = await AsyncStorage.getItem(REGISTRATION_KEY);
      if (registrations) {
        const registeredIds = JSON.parse(registrations);
        setIsRegistered(registeredIds.includes(announcement.id));
      }
    } catch (error) {
      console.error('Error checking registration status:', error);
    }
  }, [announcement.id]);

  useEffect(() => {
    checkRegistrationStatus();
  }, [checkRegistrationStatus]);

  const handleRegister = async () => {
    try {
      if (isRegistered) {
        Alert.alert(
          'Already Registered',
          'You have already sent a registration request for this event.',
        );
        return;
      }

      const registrations = await AsyncStorage.getItem(REGISTRATION_KEY);
      const registeredIds = registrations ? JSON.parse(registrations) : [];

      registeredIds.push(announcement.id);
      await AsyncStorage.setItem(
        REGISTRATION_KEY,
        JSON.stringify(registeredIds),
      );

      setIsRegistered(true);

      Alert.alert(
        'Registration Sent',
        'Your registration request has been sent successfully!',
      );
    } catch (error) {
      console.error('Error registering:', error);
      Alert.alert(
        'Error',
        'There was an error processing your registration. Please try again.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <ArrowLeftIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Announcement</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Image
            source={announcement.image}
            style={styles.banner}
            resizeMode="cover"
          />

          <Text style={styles.date}>{announcement.date}</Text>
          <Text style={styles.title}>{announcement.title}</Text>
          <Text style={styles.description}>{announcement.content}</Text>

          {announcement.courtName && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Location</Text>
              <Text style={styles.infoText}>{announcement.courtName}</Text>
              <Text style={styles.infoText}>{announcement.address}</Text>
            </View>
          )}

          {(announcement.availableSlots !== undefined ||
            announcement.registeredUsers !== undefined) && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Registration Status</Text>
              {announcement.availableSlots !== undefined && (
                <Text style={styles.infoText}>
                  Available Slots: {announcement.availableSlots}
                </Text>
              )}
              {announcement.registeredUsers !== undefined && (
                <Text style={styles.infoText}>
                  Registered Users: {announcement.registeredUsers}
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {announcement.availableSlots !== undefined &&
        announcement.availableSlots > 0 && (
          <View style={styles.buttonContainer}>
            <Button
              title={isRegistered ? 'Already Registered' : 'Register Now'}
              onPress={handleRegister}
              height={48}
              disabled={isRegistered}
            />
          </View>
        )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#E0E0E0',
  },
  container: {
    paddingVertical: 32,
    backgroundColor: '#1A1A1A',
  },
  content: {
    paddingTop: 8,
  },
  banner: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
  },
  date: {
    fontSize: 15,
    color: '#8FA2A2',
    marginBottom: 10,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 24,
    lineHeight: 22,
  },
  infoSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E0E0E0',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 8,
    lineHeight: 22,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#444',
    marginBottom: 16,
  },
});

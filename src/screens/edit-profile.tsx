import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../constants/colors';
import {UserIcon} from '../assets/svg/user-icon';
import {Button} from '../components/button';
import {PencilIcon} from '../assets/svg/pencil-icon';
import {ArrowLeftIcon} from '../assets/svg/arrow-left-icon';
import {useNavigation} from '@react-navigation/native';

const PROFILE_STORAGE_KEY = 'user_profile';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const EditProfileScreen = () => {
  const [name, setName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);
  const height = useSafeAreaInsets().top;
  const navigation = useNavigation();

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          setName(profile.name || '');
          setLastName(profile.lastName || '');
          setEmail(profile.email || '');
          setLocalAvatarUri(profile.avatarUri || null);
        }
      } catch (error) {
        console.error('Failed to load profile data from storage', error);
      }
    };
    loadProfileData();
  }, []);

  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        const newUri: string | null = response.assets[0].uri ?? null;
        setLocalAvatarUri(newUri);
      } else if (response.didCancel) {
        Alert.alert('Cancelled image selection');
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    });
  };

  const handleSave = async () => {
    if (name.trim() || lastName.trim() || localAvatarUri) {
      try {
        const profile = {
          name: name.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          avatarUri: localAvatarUri,
        };
        await AsyncStorage.setItem(
          PROFILE_STORAGE_KEY,
          JSON.stringify(profile),
        );
        Alert.alert('Profile Updated');
      } catch (error) {
        Alert.alert('Error', 'Failed to save profile data');
        console.error('Failed to save profile data to storage', error);
      }
    } else {
      Alert.alert('Error', 'Please enter valid data');
    }
  };

  const handleDelete = async () => {
    try {
      setName('');
      setLastName('');
      setEmail('');
      setLocalAvatarUri(null);

      await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
      Alert.alert('Profile Deleted', 'All fields have been cleared.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete profile data');
      console.error('Failed to delete profile data', error);
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
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View
          style={[
            styles.avatarContainer,
            {marginTop: screenHeight > 900 ? height + 20 : height},
          ]}>
          {localAvatarUri ? (
            <Image
              source={{uri: localAvatarUri}}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarCircle}>
              <UserIcon width={72} height={72} />
            </View>
          )}
          <TouchableOpacity
            onPress={selectImage}
            style={styles.editAvatarButton}>
            <PencilIcon color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.profileContainer}>
          <View style={styles.inputsContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                placeholderTextColor={COLORS.greyPrimary}
              />
              <PencilIcon color={COLORS.black} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor={COLORS.greyPrimary}
              />
              <PencilIcon color={COLORS.black} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor={COLORS.greyPrimary}
              />
              <PencilIcon color={COLORS.black} />
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <Button title="Save" onPress={handleSave} height={50} />
            <Button
              title="Delete"
              onPress={handleDelete}
              height={50}
              secondary
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf9f4',
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
    color: COLORS.black,
  },
  scrollContent: {
    flexGrow: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6F7F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  editAvatarButton: {
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: 50,
    backgroundColor: '#4EC6B7',
    padding: 7,
    position: 'absolute',
    bottom: 10,
    right: screenWidth / 2 - 50,
  },
  profileContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: '500',
    fontSize: 24,
    color: COLORS.black,
    marginBottom: 24,
  },
  inputsContainer: {
    gap: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: COLORS.black,
  },
  buttonsContainer: {
    gap: 10,
    marginTop: 32,
    marginBottom: 24,
  },
});

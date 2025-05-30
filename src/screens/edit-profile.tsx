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
import DropDownPicker from 'react-native-dropdown-picker';
import {skillLevels} from '../data/levels';

const PROFILE_STORAGE_KEY = 'user_profile';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const EditProfileScreen = () => {
  const [name, setName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);
  const [skillLevel, setSkillLevel] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(skillLevels);
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
          setSkillLevel(profile.skillLevel || null);
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
    try {
      const profile = {
        name: name.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        avatarUri: localAvatarUri,
        skillLevel: skillLevel,
      };
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      Alert.alert('Profile Updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile data');
      console.error('Failed to save profile data to storage', error);
    }
  };

  const handleDelete = async () => {
    try {
      setName('');
      setLastName('');
      setEmail('');
      setLocalAvatarUri(null);
      setSkillLevel(null);

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
              <PencilIcon color="#21706A" />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor={COLORS.greyPrimary}
              />
              <PencilIcon color="#21706A" />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor={COLORS.greyPrimary}
              />
              <PencilIcon color="#21706A" />
            </View>
            <View style={styles.dropdownContainer}>
              <DropDownPicker
                open={open}
                value={skillLevel}
                items={items}
                setOpen={setOpen}
                setValue={setSkillLevel}
                setItems={setItems}
                style={styles.dropdown}
                textStyle={styles.dropdownText}
                placeholder="Select your skill level"
                placeholderStyle={styles.dropdownPlaceholder}
                dropDownContainerStyle={styles.dropdownList}
                zIndex={3000}
                zIndexInverse={1000}
                theme="DARK"
              />
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
    backgroundColor: '#1A1A1A',
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
    color: COLORS.white,
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
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  editAvatarButton: {
    borderWidth: 2,
    borderColor: '#1A1A1A',
    borderRadius: 50,
    backgroundColor: '#21706A',
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
    color: COLORS.white,
    marginBottom: 24,
  },
  inputsContainer: {
    gap: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  input: {
    flex: 1,
    height: 30,
    fontSize: 16,
    color: COLORS.white,
  },
  buttonsContainer: {
    gap: 10,
    marginTop: 32,
    marginBottom: 24,
  },
  dropdownContainer: {
    marginBottom: 24,
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: '#2C2C2C',
    borderColor: '#2C2C2C',
    borderRadius: 12,
    height: 40,
  },
  dropdownText: {
    color: COLORS.white,
    fontSize: 16,
  },
  dropdownPlaceholder: {
    color: COLORS.greyPrimary,
  },
  dropdownList: {
    backgroundColor: '#2C2C2C',
    borderColor: '#2C2C2C',
    borderRadius: 12,
  },
  dropdownArrow: {
    tintColor: COLORS.greyPrimary,
  },
});

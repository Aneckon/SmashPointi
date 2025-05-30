import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {UserIcon} from '../assets/svg/user-icon';
import {ClockIcon} from '../assets/svg/clock-icon';
import {ArrowRightIcon} from '../assets/svg/arrow-right-icon';
import {COLORS} from '../constants/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/main';

type ProfileScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export const SettingsScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <ProfileButton
          icon={<UserIcon width={24} height={24} />}
          label="Profile"
          onPress={() => navigation.navigate('EditProfile')}
        />
        <ProfileButton
          icon={<ClockIcon width={24} height={24} />}
          label="Game History"
          onPress={() => navigation.navigate('GameHistory')}
        />
      </View>
    </SafeAreaView>
  );
};

const ProfileButton = ({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.8}
      onPress={onPress}>
      <View style={styles.buttonContent}>
        <View style={styles.buttonIcon}>{icon}</View>
        <Text style={styles.buttonLabel}>{label}</Text>
        <ArrowRightIcon width={24} height={24} style={styles.arrowIcon} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf9f4',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.black,
  },
  buttonsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  buttonIcon: {
    marginRight: 16,
  },
  buttonLabel: {
    flex: 1,
    fontSize: 18,
    color: COLORS.black,
    fontWeight: '600',
  },
  arrowIcon: {
    marginLeft: 8,
  },
});

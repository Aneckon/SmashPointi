import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from '../components/button';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/main';
import {GameActiveIcon} from '../assets/svg/game-active-icon';
import {IMAGES} from '../constants/images';

const {width} = Dimensions.get('window');

type WelcomeScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <View style={styles.heroSection}>
            <Image source={IMAGES.logo} style={styles.heroImage} />
          </View>

          <View style={styles.messageContainer}>
            <View style={styles.featureItem}>
              <View style={styles.featureRow}>
                <GameActiveIcon />
                <Text style={styles.featureText}>Your Padel Community</Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureRow}>
                <GameActiveIcon />
                <Text style={styles.featureText}>Connect with players</Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureRow}>
                <GameActiveIcon />
                <Text style={styles.featureText}>Book courts</Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureRow}>
                <GameActiveIcon />
                <Text style={styles.featureText}>Track your progress</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('MainTabs')}
            height={56}
          />
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  heroSection: {
    height: width * 0.4,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  messageContainer: {
    marginBottom: 32,
    gap: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E0E0E0',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#E0E0E0',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#4EC6B7',
  },
  secondaryButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4EC6B7',
  },
  secondaryButtonText: {
    color: '#4EC6B7',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresContainer: {
    gap: 20,
  },
  featureItem: {
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#E0E0E0',
    fontWeight: '500',
  },
});

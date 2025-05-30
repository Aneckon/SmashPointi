import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS} from '../../constants/colors';

type ButtonProps = {
  title: string;
  onPress: () => void;
  height?: number;
  secondary?: boolean;
  disabled?: boolean;
};

export const Button = ({
  title,
  onPress,
  height = 41,
  secondary,
  disabled = false,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.button, {height}, secondary && styles.secondary]}
      onPress={onPress}>
      <Text style={[styles.buttonText, secondary && {color: '#4EC6B7'}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4EC6B7',
    marginTop: 12,
    borderRadius: 43,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: '600',
    color: COLORS.white,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4EC6B7',
  },
});

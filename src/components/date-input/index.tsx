import {Pressable, Text, View} from 'react-native';
import {format} from 'date-fns';
import React, {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import {COLORS} from '../../constants/colors';
import {styles} from './styles';

type DateInputProps = {
  placeholder?: string;
  value: Date | null;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  dateFormat?: string;
  timeFormat?: string;
};

export const DateInput = ({
  placeholder = 'DD/MM/YY',
  value,
  onChange,
  mode = 'date',
  dateFormat = 'dd/MM/yy',
  timeFormat = 'HH:mm',
}: DateInputProps) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = (pickedDate: Date) => {
    setOpen(false);
    onChange(pickedDate);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handlePress = () => {
    setOpen(true);
  };

  const getDisplayText = () => {
    if (!value) {
      return placeholder;
    }

    if (mode === 'date') {
      return format(value, dateFormat);
    }
    if (mode === 'time') {
      return format(value, timeFormat);
    }
    // datetime mode
    return `${format(value, dateFormat)} ${format(value, timeFormat)}`;
  };

  const textColor = value ? COLORS.white : COLORS.greyPrimary;
  const displayText = getDisplayText();

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress} style={styles.row}>
        <Text style={[styles.placeholderText, {color: textColor}]}>
          {displayText}
        </Text>
        <DatePicker
          modal
          mode={mode}
          date={value || new Date()}
          open={open}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </Pressable>
    </View>
  );
};

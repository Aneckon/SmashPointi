import {useCallback, useState} from 'react';
import {TextInput, View} from 'react-native';
import debounce from 'lodash/debounce';
import {SearchIcon} from '../../assets/svg/search-icon';
import {styles} from './styles';
import {COLORS} from '../../constants/colors';

type SearchInputProps = {
  onSearch: (val: string) => void | undefined;
  placeholder: string;
};

export const SearchInput = ({onSearch, placeholder}: SearchInputProps) => {
  const [query, setQuery] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      onSearch?.(searchQuery);
    }, 1000),
    [],
  );

  const handleChange = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  return (
    <View style={styles.container}>
      <SearchIcon />
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        value={query}
        placeholderTextColor={COLORS.greyPrimary}
        onChangeText={handleChange}
      />
    </View>
  );
};

import {TextInput as RNTextInput} from 'react-native';
import {withUnistyles} from 'react-native-unistyles';
import type {UnistylesTheme} from '../../unistyles';

export const TextInput = withUnistyles(RNTextInput, (theme: UnistylesTheme) => ({
  // @ts-expect-error: Can't with user provided theme
  placeholderTextColor: theme?.colors?.mutedForeground,
})) as unknown as typeof RNTextInput;

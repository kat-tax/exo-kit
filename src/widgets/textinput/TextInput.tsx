import {TextInput as RNTextInput} from 'react-native';
import {withUnistyles} from 'react-native-unistyles';

export const TextInput = withUnistyles(RNTextInput, (theme: any) => ({
  placeholderTextColor: theme?.colors?.mutedForeground,
})) as unknown as typeof RNTextInput;

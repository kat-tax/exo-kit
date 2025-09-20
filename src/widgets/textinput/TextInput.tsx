import {TextInput as RNTextInput} from 'react-native';
import {withUnistyles} from 'react-native-unistyles';

import type {TextInputComponent} from 'react-native';

export const TextInput = withUnistyles(RNTextInput, (theme: any) => ({
  placeholderTextColor: theme?.colors?.mutedForeground,
})) as unknown as TextInputComponent;

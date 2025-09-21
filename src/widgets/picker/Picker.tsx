import {Picker as RNPicker} from '@react-native-picker/picker';
import {withUnistyles} from 'react-native-unistyles';
import {UnistylesTheme} from '../../unistyles';

export const Picker = withUnistyles(RNPicker, (theme: UnistylesTheme) => ({
  // @ts-expect-error: Can't with user provided theme
  dropdownIconColor: theme.colors.foreground,
})) as unknown as typeof RNPicker;

Picker.Item = withUnistyles(RNPicker.Item, (theme: UnistylesTheme) => ({
  // @ts-expect-error: Can't with user provided theme
  color: theme.colors.foreground,
}));

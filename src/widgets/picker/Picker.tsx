import {Picker as RNPicker} from '@react-native-picker/picker';
import {withUnistyles} from 'react-native-unistyles';

export const Picker = withUnistyles(RNPicker, (theme: any) => ({
  dropdownIconColor: theme.colors.foreground,
})) as unknown as typeof RNPicker;

Picker.Item = withUnistyles(RNPicker.Item, (theme: any) => ({
  color: theme.colors.foreground,
}));

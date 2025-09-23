import {Sheet as SheetBase} from './Sheet';
import {withUnistyles} from 'react-native-unistyles';
import {UnistylesTheme} from '../../unistyles';

export const Sheet = withUnistyles(SheetBase, (theme: UnistylesTheme) => ({
  // @ts-expect-error: Can't with user provided theme
  backgroundColor: theme?.colors?.background,
  grabberProps: {
    // @ts-expect-error: Can't with user provided theme
    color: theme?.colors?.input,
  },
})) as unknown as typeof SheetBase;

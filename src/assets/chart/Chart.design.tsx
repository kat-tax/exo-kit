import {Chart as ChartBase} from './Chart';
import {withUnistyles} from 'react-native-unistyles';
import {UnistylesTheme} from '../../unistyles';

export const Chart = withUnistyles(ChartBase, (_theme: UnistylesTheme) => ({
  option: {
    backgroundColor: 'transparent',
  },
})) as unknown as typeof ChartBase;

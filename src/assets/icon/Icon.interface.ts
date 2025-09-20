import type {StyleSheet} from 'react-native';
import type {Mappings} from '../../unistyles';

export type IconComponent = ((
  props: IconProps & {
    /** Override color using Unistyles theme */
    uniProps?: Mappings<IconProps>,
  },
) => JSX.Element | null) & {
  New: (
    icon?: React.ReactElement,
    styles?: StyleSheet.NamedStyles<object>,
  ) => React.ReactElement | null,
};

export interface IconProps {
  /** The name of the icon to display */
  name: string,
  /** The size of the icon */
  size?: number,
  /** The color of the icon */
  color?: string,
  /** The identifier used for testing */
  testID?: string,
  /** The override styles of the icon */
  style?: StyleSheet.NamedStyles<object>,
}

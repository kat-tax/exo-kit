import {Icon as IconBase} from './Icon';
import {useMemo, cloneElement} from 'react';
import {withUnistyles} from 'react-native-unistyles';
import {IconRemote} from './remote/Icon';

import type {StyleSheet} from 'react-native';
import type {IconComponent} from './Icon.base';
import type {UnistylesTheme} from '../../unistyles';

const IconThemed = withUnistyles(IconBase, (theme: UnistylesTheme) => ({
  // @ts-expect-error: user provided theme
  color: theme?.colors?.foreground,
}));

const Icon: IconComponent = ({style, ...props}) => {
  const styles = useMemo(() => merge(style), [style]);
  return <IconThemed {...props} {...styles} />
}

Icon.Remote = withUnistyles(IconRemote, (theme: UnistylesTheme) => ({
  // @ts-expect-error: user provided theme
  color: theme?.colors?.foreground,
}));

Icon.New = (icon?: React.ReactElement, styles?: StyleSheet.NamedStyles<object>) => {
  if (!icon) return null;
  return cloneElement(icon, merge(styles));
}

function merge(styles?: StyleSheet.NamedStyles<object>) {
  if (!styles || typeof styles !== 'object') return {};
  const icon: {name?: string, size?: number, color?: string} = {};
  Object.values(styles)?.forEach(i => {
    if (i && typeof i === 'object') {
      if ('color' in i) icon.color = i.color;
      if ('size' in i) icon.size = i.size;
      if ('name' in i) icon.name = i.name;
    }
  });
  return icon;
}

export default Icon;
export {Icon};

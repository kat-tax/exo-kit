import {Icon as IconBase} from './Icon';
import {withUnistyles} from 'react-native-unistyles';
import {useMemo, cloneElement} from 'react';

import type {StyleSheet} from 'react-native';
import type {IconComponent} from './Icon.interface';

const IconThemed = withUnistyles(IconBase, (theme: any) => ({
  color: theme?.colors?.foreground,
}));

const Icon: IconComponent = ({style, ...props}) => {
  const styles = useMemo(() => merge(style), [style]);
  return (
    <IconThemed
      {...props}
      {...styles}
    />
  );
}

Icon.New = (icon?: React.ReactElement, styles?: StyleSheet.NamedStyles<object>) => {
  if (!icon) return null;
  return cloneElement(icon, merge(styles));
}

function merge(style?: StyleSheet.NamedStyles<object>) {
  if (!style || typeof style !== 'object') return {};
  const icon: {name?: string, size?: number, color?: string} = {};
  Object.values(style)?.forEach(i => {
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

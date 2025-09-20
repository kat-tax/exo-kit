import {Icon as IconBase} from './Icon';
import {useMemo, cloneElement} from 'react';
import {withUnistyles} from 'react-native-unistyles';
import {mergeStyles} from './utils/mergeStyles';

import type {StyleSheet} from 'react-native';
import type {IconComponent} from './Icon.interface';

const IconThemed = withUnistyles(IconBase, (theme: any) => ({
  color: theme?.colors?.foreground,
}));

const Icon: IconComponent = ({style, ...props}) => {
  const styles = useMemo(() => mergeStyles(style), [style]);
  return (
    <IconThemed
      {...props}
      {...styles}
    />
  );
}

Icon.New = (icon?: React.ReactElement, styles?: StyleSheet.NamedStyles<object>) => {
  if (!icon) return null;
  return cloneElement(icon, mergeStyles(styles));
}

export default Icon;
export {Icon};

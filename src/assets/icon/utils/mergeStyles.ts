import type {StyleSheet} from 'react-native';

export function mergeStyles(styles?: StyleSheet.NamedStyles<object>) {
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

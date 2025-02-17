export type StyleTuple = [string, string]

export interface Style {
  [key: string]: string | number | Style
}

export const textStyles = [
  'color',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'includeFontPadding',
  'letterSpacing',
  'lineHeight',
  'textAlign',
  'textAlignVertical',
  'textDecorationColor',
  'textDecorationLine',
  'textDecorationStyle',
  'textShadowColor',
  'textShadowOffset',
  'textShadowRadius',
  'textTransform',
  'writingDirection',
];

export function removeTextStyleProps(style: Style): Style {
  const obj = {...style};
  for (const value of textStyles.filter(v => Object.keys(style).includes(v))) {
    delete obj[value];
  }
  return obj;
}

export function convertInlineStyles(_style: string): Style {
  // const rules = style.split(';');
  // const tuples = rules
  //   .map((rule) => {
  //     let [key, value] = rule.split(':');
  //     if (key && value) {
  //       key = key.trim();
  //       value = value.trim();
  //       return [key, value] as StyleTuple;
  //     }
  //     return null;
  //   })
  //   .filter((x) => x !== null);
  // return cssToReactNative(tuples);
  return {};
}

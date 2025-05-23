import type {StyleSheet,ViewStyle, TextStyle, ImageStyle} from 'react-native';

export interface ASTNode {
  key: string;
  type: keyof RenderRules;
  index: number;
  tokenIndex: number;
  attributes: {
    [key: string]: unknown;
    start?: number;
    style?: string;
    src?: string;
    alt?: string;
  };
  children: ASTNode[];
  block: boolean;
  markup: string;
  content: string;
  sourceType: string;
  sourceInfo: string;
  sourceMeta: unknown;
}

export interface RenderRules {
  unknown: RenderNodeFunction;
  body: RenderNodeFunction;
  heading1: RenderNodeFunction;
  heading2: RenderNodeFunction;
  heading3: RenderNodeFunction;
  heading4: RenderNodeFunction;
  heading5: RenderNodeFunction;
  heading6: RenderNodeFunction;
  hr: RenderNodeFunction;
  strong: RenderNodeFunction;
  em: RenderNodeFunction;
  s: RenderNodeFunction;
  blockquote: RenderNodeFunction;
  bullet_list: RenderNodeFunction;
  ordered_list: RenderNodeFunction;
  list_item: RenderNodeFunction;
  code_inline: RenderNodeFunction;
  code_block: RenderNodeFunction;
  fence: RenderNodeFunction;
  table: RenderNodeFunction;
  thead: RenderNodeFunction;
  tbody: RenderNodeFunction;
  th: RenderNodeFunction;
  tr: RenderNodeFunction;
  td: RenderNodeFunction;
  link: RenderLinkFunction;
  blocklink: RenderLinkFunction;
  image: RenderImageFunction;
  text: RenderNodeFunction;
  textgroup: RenderNodeFunction;
  paragraph: RenderNodeFunction;
  hardbreak: RenderNodeFunction;
  softbreak: RenderNodeFunction;
  pre: RenderNodeFunction;
  inline: RenderNodeFunction;
  span: RenderNodeFunction;
}

export interface RenderStyles {
  // Text styles
  text: TextStyle;
  strong: TextStyle;
  em: TextStyle;
  s: TextStyle;
  // View styles (prefixed with _)
  _body: ViewStyle;
  _heading1: ViewStyle;
  _heading2: ViewStyle;
  _heading3: ViewStyle;
  _heading4: ViewStyle;
  _heading5: ViewStyle;
  _heading6: ViewStyle;
  _hr: ViewStyle;
  _blockquote: ViewStyle;
  _bullet_list: ViewStyle;
  _ordered_list: ViewStyle;
  _list_item: ViewStyle;
  _code_inline: ViewStyle;
  _code_block: ViewStyle;
  _fence: ViewStyle;
  _table: ViewStyle;
  _thead: ViewStyle;
  _tbody: ViewStyle;
  _th: ViewStyle;
  _tr: ViewStyle;
  _td: ViewStyle;
  // Image styles
  _image: ImageStyle;
}

export type RenderNodeFunction = (
  node: ASTNode,
  parents: ASTNode[],
  children: React.ReactNode[],
  styles: StyleSheet.NamedStyles<unknown>,
  stylesInherited?: StyleSheet.NamedStyles<unknown>,
  ...args: unknown[]
) => React.ReactNode;

export type RenderImageFunction = (
  node: ASTNode,
  parents: ASTNode[],
  children: React.ReactNode[],
  styles: StyleSheet.NamedStyles<unknown>,
  allowedImageHandlers: string[],
  defaultImageHandler: string,
) => React.ReactNode;

export type RenderLinkFunction = (
  node: ASTNode,
  parents: ASTNode[],
  children: React.ReactNode[],
  styles: StyleSheet.NamedStyles<unknown>,
  onLinkPress?: (url: string) => boolean,
) => React.ReactNode;

import type {TextStyle} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {BundledLanguage, BundledTheme} from 'shiki';

export interface CodeProps {
  lang?: CodeLanguages,
  theme?: CodeThemes,
  children: string,
};

export type CodeThemes = BundledTheme;
export type CodeLanguages = BundledLanguage | 'ansi' | 'text';
export type CodeTextProps = PropsWithChildren<{
  style?: TextStyle,
}>;

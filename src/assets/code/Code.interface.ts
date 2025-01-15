import type {BundledLanguage, BundledTheme} from 'shiki';
import type {TextStyle} from 'react-native';

export interface CodeProps {
  lang?: CodeLanguages,
  theme?: CodeThemes,
  children: string,
};

export type CodeThemes = BundledTheme;
export type CodeLanguages = BundledLanguage | 'ansi' | 'text';
export type CodeTokenProps = {
  children?: string,
  style?: TextStyle,
}

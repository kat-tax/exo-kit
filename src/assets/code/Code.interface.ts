import type {BundledLanguage, BundledTheme} from 'shiki';

export interface CodeProps {
  lang?: CodeLanguages,
  theme?: CodeThemes,
  children: string,
};

export type CodeThemes = BundledTheme;
export type CodeLanguages = BundledLanguage | 'ansi' | 'text';
export type CodeTokenProps = {
  children?: string,
  style?: {
    color?: string,
    fontFamily?: string,
    fontWeight?: string,
    fontStyle?: string,
    fontSize?: string,
    lineHeight?: string,
    backgroundColor?: string,
    textDecorationLine?: string,
  }
}

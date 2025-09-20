import type {
  UnistylesThemes,
  UnistylesBreakpoints,
  IOSContentSizeCategory,
  AndroidContentSizeCategory,
} from 'react-native-unistyles';

type AppThemeName = keyof UnistylesThemes;
type AppBreakpoint = keyof UnistylesBreakpoints;
type ColorScheme = 'light' | 'dark' | 'unspecified';
type UnistylesTheme = UnistylesThemes[keyof UnistylesThemes];
type SupportedStyleProps = typeof SUPPORTED_STYLE_PROPS[number];
enum WebContentSizeCategory {Unspecified = 'web-unspecified'}
const SUPPORTED_STYLE_PROPS = ['style', 'contentContainerStyle'] as const;

interface UnistylesMiniRuntime {
  readonly colorScheme: ColorScheme,
  readonly contentSizeCategory: IOSContentSizeCategory | AndroidContentSizeCategory | WebContentSizeCategory,
  // additional metadata
  readonly themeName?: AppThemeName,
  readonly breakpoint?: AppBreakpoint,
}

export type Mappings<T = {}> = (
  theme: UnistylesTheme,
  rt: UnistylesMiniRuntime,
) => Omit<Partial<T>, SupportedStyleProps> & {key?: string};

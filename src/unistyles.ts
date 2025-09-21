import type {
  UnistylesThemes,
  UnistylesBreakpoints,
  IOSContentSizeCategory,
  AndroidContentSizeCategory,
} from 'react-native-unistyles';

// Derived types (not exported :/)
type AppThemeName = keyof UnistylesThemes;
type AppBreakpoint = keyof UnistylesBreakpoints;
type ColorScheme = 'light' | 'dark' | 'unspecified';
type SupportedStyleProps = typeof SUPPORTED_STYLE_PROPS[number];
const SUPPORTED_STYLE_PROPS = ['style', 'contentContainerStyle'] as const;
enum WebContentSizeCategory {Unspecified = 'web-unspecified'}
interface UnistylesMiniRuntime {
  readonly colorScheme: ColorScheme,
  readonly contentSizeCategory: IOSContentSizeCategory | AndroidContentSizeCategory | WebContentSizeCategory,
  // additional metadata
  readonly themeName?: AppThemeName,
  readonly breakpoint?: AppBreakpoint,
}

// Exported derived types (needed for unistyles component props)
export type UnistylesTheme = UnistylesThemes[keyof UnistylesThemes];
export type Mappings<T = {}> = (
  theme: UnistylesTheme,
  rt: UnistylesMiniRuntime,
) => Omit<Partial<T>, SupportedStyleProps> & {key?: string};

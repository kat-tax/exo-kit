import {useState, useEffect} from 'react';

export interface ThemeProps {
  children: (theme: string) => void,
}

export function Theme(props: ThemeProps) {
  const [theme, setTheme] = useState(typeof window !== 'undefined'
    ? document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
    : 'light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const pickerButton = document.querySelector('button:has(.vocs_utils_visibleDark)');
    const updateTheme = () => {
      requestAnimationFrame(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');
      })
    };
    mediaQuery.addEventListener('change', updateTheme);
    pickerButton?.addEventListener('click', updateTheme);
    updateTheme();
    return () => {
      mediaQuery.removeEventListener('change', updateTheme);
      pickerButton?.removeEventListener('click', updateTheme);
    }
  }, []);

  return props.children(theme);
}

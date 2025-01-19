import {createHighlighter} from 'shiki';
import {useEffect, useState, useRef} from 'react';
import {Display} from './lib/Display';
import engine from './lib/Engine';

import type {ThemedToken} from 'shiki/core';
import type {CodeProps} from './Code.interface';

const highlighterInit = createHighlighter({
  engine,
  langs: [],
  themes: ['dark-plus', 'light-plus'],
});

export function Code(props: CodeProps) {
  const {lang, theme, children} = props;
  const [tokens, setTokens] = useState<ThemedToken[][]>();
  const shiki = useRef<Awaited<typeof highlighterInit>>();

  useEffect(() => {
    (async (lang, theme) => {
      shiki.current = await highlighterInit;
      await Promise.all([
        shiki.current?.loadLanguage(lang),
        shiki.current?.loadTheme(theme),
      ]);
      setTokens(shiki.current.codeToTokensBase(
        children,
        {lang, theme},
      ));
    })(lang ?? 'text', theme ?? 'light-plus');
  }, [children, lang, theme]);

  return (
    <Display tokens={tokens}>
      {children}
    </Display>
  );
}

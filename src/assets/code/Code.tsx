import {createHighlighter} from 'shiki';
import {useEffect, useState, useRef} from 'react';
import {Display} from './lib/Display';
import engine from './lib/Engine';

import type {ThemedToken} from 'shiki/core';
import type {CodeProps} from './Code.interface';

const highlighterInit = createHighlighter({
  engine,
  themes: ['dark-plus', 'light-plus'],
  langs: ['typescript', 'tsx'],
});

export function Code(props: CodeProps) {
  const {lang, theme, children} = props;
  const [tokens, setTokens] = useState<ThemedToken[][]>();
  const shiki = useRef<Awaited<typeof highlighterInit>>();

  // Load language when it changes
  useEffect(() => {
    if (!lang || lang === 'ansi' || lang === 'text') return;
    if (shiki.current?.getLoadedLanguages().includes(lang)) return;
    shiki.current?.loadLanguage(lang);
  }, [lang]);

  // Update tokens when children language, or theme changes
  useEffect(() => {
    (async () => {
      shiki.current = await highlighterInit;
      setTokens(shiki.current.codeToTokensBase(children, {
        lang: lang ?? 'text',
        theme: theme ?? 'light-plus',
      }));
    })();
  }, [children, lang, theme]);

  return (
    <Display tokens={tokens}>
      {children}
    </Display>
  );
}

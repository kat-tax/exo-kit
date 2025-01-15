import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {Token} from './Token';

import type {TextStyle} from 'react-native';
import type {ThemedToken} from 'shiki/core';

const fontSize = 14;
const lineHeight = 20;

interface DisplayProps {
  tokens?: ThemedToken[][],
  children?: string,
}

export function Display(props: DisplayProps) {
  const {tokens, children} = props;
  return (
    <ScrollView style={styles.codeContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={styles.codeScrollContainer}>
          {tokens ? tokens.map((line, index) => (
            <View
              key={genLineKey(index, line)}
              style={styles.codeLine}>
              {line.map((token, tokenIndex) => (
                <Token
                  key={genTokenKey(index, tokenIndex, token)}
                  style={getTokenStyle(token)}>
                  {token.content}
                </Token>
              ))}
            </View>
          )) : (
            <Token style={{fontFamily, fontSize, lineHeight}}>
              {children}
            </Token>
          )}
        </View>
      </ScrollView>
    </ScrollView>
  )
}

function genLineKey(index: number, lineContent: ThemedToken[]) {
  const lineText = lineContent.map(token => token.content).join('')
  return `line-${index}-${lineText}`;
}

function genTokenKey(index: number, tokenIndex: number, token: ThemedToken) {
  return `token-${index}-${tokenIndex}-${token.offset}-${token.content}`;
}

function getTokenStyle({color, fontStyle, bgColor}: ThemedToken): TextStyle  {
  const isItalic = fontStyle === 1;
  const isBold = fontStyle === 2;
  const isUnderline = fontStyle === 4;
  const isStrikethrough = fontStyle === 8;
  return {
    color,
    fontFamily,
    fontWeight: isBold ? '500' : undefined,
    fontStyle: isItalic ? 'italic' : 'normal',
    fontSize,
    lineHeight,
    backgroundColor: bgColor,
    textDecorationLine: isUnderline
      ? 'underline'
      : isStrikethrough
        ? 'line-through'
        : undefined,
  }
}

const fontFamily = Platform.select({
  web: 'Fira Code',
  ios: 'Menlo',
  android: 'monospace',
});

const styles = StyleSheet.create({
  codeContainer: {
    alignSelf: 'stretch',
    flexShrink: 1,
  },
  codeScrollContainer: {
    flexDirection: 'column',
    minWidth: '100%',
    // @ts-ignore
    whiteSpace: 'pre',
  },
  codeLine: {
    flexDirection: 'row',
    marginBottom: 0,
    minHeight: lineHeight,
  },
});

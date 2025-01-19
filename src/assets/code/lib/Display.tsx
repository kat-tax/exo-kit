import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {Text} from './Text';

import type {TextStyle} from 'react-native';
import type {ThemedToken} from 'shiki/core';

interface DisplayProps {
  tokens?: ThemedToken[][],
  children?: string,
}

export function Display(props: DisplayProps) {
  const {tokens, children} = props;
  const {fontFamily, fontSize, lineHeight} = typography;
  return (
    <ScrollView style={styles.root}>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={styles.contents}>
          {tokens ? tokens.map((line, index) => (
            <Text
              key={genLineKey(index, line)}
              style={{lineHeight}}>
              {line.length > 0 ? line.map((token, tokenIndex) => (
                <Text
                  key={genTokenKey(index, tokenIndex, token)}
                  style={getTokenStyle(token)}>
                  {token.content}
                </Text>
              )) : '\n'}
            </Text>
          )) : (
            <Text style={{fontFamily, fontSize, lineHeight}}>
              {children}
            </Text>
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
  const {fontFamily, fontSize, lineHeight} = typography;
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

const typography = {
  lineHeight: 20,
  fontSize: 14,
  fontFamily: Platform.select({
    web: 'Fira Code',
    ios: 'Menlo',
    android: 'monospace',
  }),
};

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    flexShrink: 1,
  },
  contents: {
    flexDirection: 'column',
    minWidth: '100%',
    // @ts-ignore
    whiteSpace: 'pre',
  },
});

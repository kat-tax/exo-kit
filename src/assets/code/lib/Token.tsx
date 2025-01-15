import type {CSSProperties} from 'react';
import type {CodeTokenProps} from '../Code.interface';

export const Token = ({style, children}: CodeTokenProps) => (
  <span style={{
    ...style as CSSProperties,
    fontSize: `${style?.fontSize}px`,
    lineHeight: `${style?.lineHeight}px`,
  }}>
    {children}
  </span>
);

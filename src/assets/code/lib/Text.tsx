import type {CSSProperties} from 'react';
import type {CodeTextProps} from '../Code.interface';

export const Text = ({style, children}: CodeTextProps) => (
  <span style={{
    ...style as CSSProperties,
    fontSize: `${style?.fontSize}px`,
    lineHeight: `${style?.lineHeight}px`,
  }}>
    {children}
  </span>
);

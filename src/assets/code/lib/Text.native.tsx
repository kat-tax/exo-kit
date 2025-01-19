import {createElement} from 'react';
import type {CodeTextProps} from '../Code.interface';

export const Text = (props: CodeTextProps) => (
  createElement('RCTText', props)
);

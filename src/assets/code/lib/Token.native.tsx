import {createElement} from 'react';
import type {CodeTokenProps} from '../Code.interface';

export const Token = (props: CodeTokenProps) => createElement('RCTText', props);
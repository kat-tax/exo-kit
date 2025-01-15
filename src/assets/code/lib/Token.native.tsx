import {createElement} from 'react';
import type {CodeTokenProps} from '../Code.interface';
export const Token = (props: CodeTokenProps) => createElement('RCTText', props);

// FIXME: Below disabled due to: https://github.com/bluesky-social/react-native-uitextview/issues/19
// This will enable selectable text in the future

// import {UITextView as Text} from 'react-native-uitextview';

// import type {CodeTokenProps} from '../Code.interface';
// import type {TextStyle} from 'react-native';

// export const Token = (props: CodeTokenProps) => (
//   <Text uiTextView selectable style={{...props.style as TextStyle}}>
//     {props.children}
//   </Text>
// );

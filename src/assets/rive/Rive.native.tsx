import {forwardRef} from 'react';
import RiveBase from 'rive-react-native';

import type {RiveComponent, RiveProps, RiveRef} from './Rive.interface';
import type {Fit} from 'rive-react-native';

export const Rive: RiveComponent = forwardRef((props: Omit<RiveProps, 'ref'>, ref: React.Ref<RiveRef>) => {
  const {width, height} = props;
  return (
    <RiveBase
      ref={ref}
      url={props.url}
      fit={props.resizeMode as Fit}
      style={{...props.style, width, height}}
      autoplay={props.autoplay}
      alignment={props.alignment}
      artboardName={props.artboardName}
      animationName={props.animationName}
      stateMachineName={props.stateMachineName}
      testID={props.testID}
    />
  );
});

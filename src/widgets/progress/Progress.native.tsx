import {Fragment} from 'react';
import type {ProgressComponent, ProgressProps} from './Progress.interface';

export const Progress: ProgressComponent = (_props: ProgressProps) => {
  return (
    <Fragment/>
    // <ProgressBar
    //   testID={props.testID}
    //   progress={props.progress}
    //   progressColor={props.progressColor || '#000'}
    //   customElement={props.customElement}
    //   fullWidth={props.fullWidth}
    //   style={props.style}
    // />
  );
}

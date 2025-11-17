import {getUrl} from './Icon.base';
import type {IconRemoteProps} from './Icon.base';

export const IconRemote = (props: IconRemoteProps) => {
  return (
    <div
      style={{
        backgroundColor: props.color,
        color: props.color,
        width: props.size,
        height: props.size,
        mask: `url(${getUrl(props.name)}) no-repeat center / 100%`,
      }}
    />
  );
}

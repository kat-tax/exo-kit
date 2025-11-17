import {useMemo} from 'react';
import {blo} from 'blo';

import {SIZE_DEFAULT} from './Avatar.base';
import type {AvatarProps} from './Avatar.base';

export function Avatar(props: AvatarProps) {
  const size = props.size ?? SIZE_DEFAULT;
  const uri = useMemo(() => props.id ? blo(`0x${props.id}`) : '', [props.id]);
  return props.id ? (
    <img
      src={uri}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        borderRadius: 3,
      }}
    />
  ) : null;
}

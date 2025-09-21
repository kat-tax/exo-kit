import {useState, useEffect} from 'react';
import {SvgXml} from 'react-native-svg';

import {getUrl} from './Icon.base';
import type {IconRemoteProps} from './Icon.base';

export const IconRemote = (props: IconRemoteProps) => {
  const [svg, setSvg] = useState('');

  useEffect(() => {
    fetch(getUrl(props.name))
      .then(res => res.text())
      .then(setSvg);
  }, [props.name]);

  return svg ? (
    <SvgXml
      xml={svg}
      width={props.size}
      height={props.size}
      color={props.color}
    />
  ) : null;
}

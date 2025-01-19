import {usePageImage} from './usePageImage';

import type {DimensionValue} from 'react-native';

interface PdfPageProps {
  index: number,
  width?: DimensionValue,
  height?: DimensionValue,
  render: (index: number) => Promise<Uint8Array>,
}

export function PdfPage(props: PdfPageProps) {
  const img = usePageImage(props.index, props.render);

  const width = typeof props.width === 'number'
    ? `${props.width}px`
    : props.width?.toString()
      ?? '100%';

  const height = typeof props.height === 'number'
    ? `${props.height}px`
    : props.height?.toString()
      ?? '100%';

  if (!img) {
    return (
      <div style={{width, height}}/>
    );
  }

  return (
    <img src={img} alt={`Page ${props.index}`}/>
  );
}

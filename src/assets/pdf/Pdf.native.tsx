import {useImperativeHandle, forwardRef} from 'react';
import PdfRendererView from 'react-native-pdf-renderer';

import type {PdfComponent, PdfProps, PdfRef} from './Pdf.interface';

export const Pdf: PdfComponent = forwardRef((
  {src, style, ...props}: PdfProps,
  ref: React.Ref<PdfRef>,
) => {
  useImperativeHandle(ref, () => ({
    prevPage: () => {
      console.log('>> pdf [native] prevPage', props);
    },
    nextPage: () => {
      console.log('>> pdf [native] nextPage', props);
    },
  }));

  return (
    <PdfRendererView
      source={typeof src === 'string' ? src : undefined}
      style={[
        {
          width: props.width ?? '100%',
          height: props.height ?? '100%',
        },
        style,
      ]}
      {...props}
    />
  );
});

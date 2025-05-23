import {forwardRef, memo} from 'react';
import {PdfProvider} from './lib/PdfContext';
import {PdfScroll} from './lib/PdfScroll';

import type {PdfComponent, PdfProps, PdfRef} from './Pdf.interface';

/** A component that displays a PDF */
export const Pdf: PdfComponent = memo(forwardRef((
  {src, onPageChange, ...props}: PdfProps,
  ref: React.Ref<PdfRef>,
) => (
  <PdfProvider {...{src, ref, onPageChange}}>
    <PdfScroll {...props}/>
  </PdfProvider>
)), (prev, next) =>
  prev.src === next.src
  && prev.width === next.width
  && prev.height === next.height
  && prev.onPageChange === next.onPageChange
  && prev.distanceBetweenPages === next.distanceBetweenPages
);

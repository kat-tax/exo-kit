import {useImperativeHandle, forwardRef, memo} from 'react';
import {PdfScroller} from './lib/PdfScroller';
import {PdfProvider} from './lib/PdfContext';

import type {PdfComponent, PdfProps, PdfRef} from './Pdf.interface';

/** A component that displays a PDF */
export const Pdf: PdfComponent = memo(forwardRef((
  {src, ...props}: PdfProps,
  ref: React.Ref<PdfRef>,
) => {

  useImperativeHandle(ref, () => ({
    prevPage: () => {
      //const [index, total] = pages;
      //setPages([Math.max(index - 1, 0), total]);
    },
    nextPage: () => {
      //const [index, total] = pages;
      //setPages([Math.min(index + 1, total - 1), total]);
    },
  }));

  //useEffect(() => props.onPageChange?.(...pages), [pages, props.onPageChange]);

  return (
    <PdfProvider data={src}>
      <PdfScroller
        {...props}
        {...{src}}
        //onPageChange={(...args) => setPages(args)}
      />
    </PdfProvider>
  );
}), (prev, next) => prev.src === next.src);

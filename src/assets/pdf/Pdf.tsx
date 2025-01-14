import {useMupdf} from './lib/useMupdf';
import {PdfScroller} from './lib/PdfScroller';
import {useImperativeHandle, useState, useCallback, useEffect, forwardRef, memo} from 'react';

import type {PdfComponent, PdfProps, PdfRef} from './Pdf.interface';
import type {NativeSyntheticEvent, NativeScrollEvent} from 'react-native';

/** A component that displays a PDF */
export const Pdf: PdfComponent = memo(forwardRef((
  {src, ...props}: PdfProps,
  ref: React.Ref<PdfRef>,
) => {
  const pdf = useMupdf();
  const [currentPage, setCurrentPage] = useState(0);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollTop = event.nativeEvent.contentOffset.y;
    const pageHeight = event.nativeEvent.layoutMeasurement.height;
    const pageIndex = Math.round(scrollTop / pageHeight);
    setCurrentPage(pageIndex);
    props.onPageChange?.(pageIndex, pdf.pageCount);
  }, [pdf.pageCount, props.onPageChange]);

  // Control Document
  useImperativeHandle(ref, () => ({
    prevPage: () => {
      setCurrentPage(Math.max(currentPage - 1, 0));
    },
    nextPage: () => {
      setCurrentPage(Math.min(currentPage + 1, pdf.pageCount - 1));
    },
  }));

  // Page Change Event
  useEffect(() => {
    props.onPageChange?.(0, pdf.pageCount);
  }, [props.onPageChange, pdf.pageCount]);

  // Load Document
  useEffect(() => {
    (async () => {
      if (typeof src === 'string') {
        const response = await fetch(src);
        const buffer = await response.arrayBuffer();
        await pdf.loadDocument(buffer);
      } else if (src instanceof ArrayBuffer) {
        await pdf.loadDocument(src);
      }
    })();
  }, [src, pdf.loadDocument]);

  return (
    <PdfScroller {...props} {...{src, pdf, onScroll}}/>
  );
}), (prev, next) => prev.src === next.src);

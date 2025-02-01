import {useContext, useEffect, useState, useImperativeHandle, useRef, createContext} from 'react';
import {useMupdf} from './mupdf.hook';

import type {LegendListRef} from '@legendapp/list';
import type {PdfRef} from '../Pdf.interface';

interface PdfProviderProps {
  src: string | ArrayBuffer | Uint8Array;
  ref: React.Ref<PdfRef>;
  children: React.ReactNode;
  onPageChange?: (page: number, totalPages: number) => void;
}

interface PdfContextType {
  renderPage: (index: number) => Promise<Uint8Array | undefined>;
  setCurrentPage: (index: number) => void;
  currentPage: number;
  pageCount: number;
  listRef: React.Ref<LegendListRef>;
}

const PdfContext = createContext<PdfContextType>({
  renderPage: () => Promise.resolve(undefined),
  setCurrentPage: () => {},
  currentPage: 0,
  pageCount: 0,
  listRef: null,
});

export function usePdf() {
  const context = useContext(PdfContext);
  if (context === undefined) {
    throw new Error('usePdf must be used within PdfProvider');
  }
  return context;
}

export function PdfProvider({src, ref, children, onPageChange}: PdfProviderProps) {
  const {started, loadDocument, getPageCount, renderPage} = useMupdf();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const listRef = useRef<LegendListRef>(null);

  // Handle document controls
  useImperativeHandle(ref, () => ({
    prevPage: () => {
      listRef.current?.scrollToIndex({
        index: Math.max(currentPage - 1, 0),
        animated: true,
      });
    },
    nextPage: () => {
      listRef.current?.scrollToIndex({
        index: Math.min(currentPage + 1, pageCount - 1),
        animated: true,
      });
    },
  }));

  // Load document on src change
  useEffect(() => {
    if (!src || !started) return;
    (async () => {
      setPageCount(0);
      setCurrentPage(0);
      let buffer: ArrayBuffer;
      if (typeof src === 'string') {
        const res = await fetch(src);
        buffer = await res.arrayBuffer();
      } else if (src instanceof Uint8Array) {
        buffer = src.buffer as ArrayBuffer;
      } else if (src instanceof ArrayBuffer) {
        buffer = src;
      } else {
        throw new Error('Invalid src type');
      }
      await loadDocument(buffer);
      setPageCount(await getPageCount());
    })();
  }, [src, started]);

  // Fire onPageChange on pages change
  useEffect(() => {
    onPageChange?.(currentPage, pageCount);
  }, [currentPage, pageCount, onPageChange]);

  return (
    <PdfContext.Provider value={{
      renderPage,
      setCurrentPage,
      currentPage,
      pageCount,
      listRef,
    }}>
      {children}
    </PdfContext.Provider>
  );
}

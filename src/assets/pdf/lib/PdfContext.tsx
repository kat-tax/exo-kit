import {createContext, useContext, useEffect, useState} from 'react';
import {useMupdf} from './mupdf.hook';

interface PdfProps {
  src: string | ArrayBuffer | Uint8Array;
  children: React.ReactNode;
  onPageChange?: (page: number, totalPages: number) => void;
}

interface PdfContext {
  renderPage: (index: number) => Promise<Uint8Array | undefined>;
  setCurrentPage: (index: number) => void;
  currentPage: number;
  pageCount: number;
}

const PdfContext = createContext<PdfContext>({
  renderPage: () => Promise.resolve(undefined),
  setCurrentPage: () => {},
  currentPage: 0,
  pageCount: 0,
});

export function usePdf() {
  const context = useContext(PdfContext);
  if (context === undefined) {
    throw new Error('usePdf must be used within PdfProvider');
  }
  return context;
}

export function PdfProvider({src, children, onPageChange}: PdfProps) {
  const {started, loadDocument, getPageCount, renderPage} = useMupdf();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

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
    }}>
      {children}
    </PdfContext.Provider>
  );
}

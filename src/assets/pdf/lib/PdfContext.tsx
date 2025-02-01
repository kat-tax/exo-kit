import {createContext, useContext, useEffect, useState} from 'react';
import {useMupdf} from './mupdf.hook';

interface PdfProps {
  data: string | ArrayBuffer | Uint8Array;
  children: React.ReactNode;
  initPageSize?: [number, number];
}

interface PdfContext {
  renderPage: (index: number) => Promise<Uint8Array | undefined>;
  setPageSize: ([width, height]: [number, number]) => void;
  currentPage: number;
  pageCount: number;
  pageSize: [number, number];
}

const PdfContext = createContext<PdfContext>({
  renderPage: () => Promise.resolve(undefined),
  setPageSize: () => {},
  currentPage: 0,
  pageCount: 0,
  pageSize: [0, 0],
});

export function usePdf() {
  const context = useContext(PdfContext);
  if (context === undefined) {
    throw new Error('usePdf must be used within PdfProvider');
  }
  return context;
}

export function PdfProvider({data, children, initPageSize}: PdfProps) {
  const {started, loadDocument, getPageCount, renderPage} = useMupdf();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState<[number, number]>(initPageSize ?? [492, 682]);

  // Load document on data change
  useEffect(() => {
    if (!data || !started) return;
    (async () => {
      setPageCount(0);
      setCurrentPage(0);
      let src: ArrayBuffer;
      if (typeof data === 'string') {
        const res = await fetch(data);
        src = await res.arrayBuffer();
      } else if (data instanceof Uint8Array) {
        src = data.buffer as ArrayBuffer;
      } else if (data instanceof ArrayBuffer) {
        src = data;
      } else {
        throw new Error('Invalid data type');
      }
      await loadDocument(src);
      setPageCount(await getPageCount());
    })();
    return () => {
      console.log('>> pdf [web] unloading document');
    }
  }, [data, started]);

  return (
    <PdfContext.Provider value={{
      renderPage,
      setPageSize,
      currentPage,
      pageCount,
      pageSize,
    }}>
      {children}
    </PdfContext.Provider>
  );
}

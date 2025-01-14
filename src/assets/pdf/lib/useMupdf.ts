/**
 * Fix errors, we need to copy assets over:
 * https://github.com/barradasotavio/mupdfjs-react-example/blob/main/vite.config.ts
 */

// @ts-ignore
import MWorker from './mupdf.worker?worker&inline';
import {useEffect, useRef, useState} from 'react';
import * as Comlink from 'comlink';

import type {MupdfWorker} from './mupdf.worker';

let webWorker: Worker | undefined;
let mupdfWorker: Comlink.Remote<MupdfWorker> | undefined;

// Initialize worker only on client side
if (typeof window !== 'undefined') {
  webWorker = new MWorker() as Worker;
  mupdfWorker = Comlink.wrap<MupdfWorker>(webWorker);
}
export function useMupdf() {
  const refBuffer = useRef<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [initialized, setInitialized] = useState(false);

  const loadDocument = async (buffer: ArrayBuffer) => {
    if (!mupdfWorker)
      throw new Error('Mupdf worker not initialized');
    refBuffer.current = buffer;
    const doc = await mupdfWorker.load(buffer);
    setPageCount(doc.pageCount);
    return doc;
  }

  const renderPage = async (index: number) => {
    if (!mupdfWorker)
      throw new Error('Mupdf worker not initialized');
    if (!refBuffer.current)
      throw new Error('Document not loaded');
    return mupdfWorker.renderPage(index, (window.devicePixelRatio * 96) / 72);
  }

  useEffect(() => {
    if (!webWorker) return;
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'MUPDF_LOADED')
        setInitialized(true);
    }
    webWorker.addEventListener('message', handleMessage);
    return () => webWorker.removeEventListener('message', handleMessage);
  }, []);

  return {
    initialized,
    pageCount,
    loadDocument,
    renderPage,
  };
}

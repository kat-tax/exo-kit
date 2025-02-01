// @ts-ignore
import MWorker from './mupdf.worker?worker&inline';
import {useCallback, useEffect, useRef, useState} from 'react';
import * as Comlink from 'comlink';

import type {Remote} from 'comlink';
import type {MupdfWorker} from './mupdf.worker';

export function useMupdf() {
  const [started, setStarted] = useState(false);
  const document = useRef<ArrayBuffer | null>(null);
  const muworker = useRef<Remote<MupdfWorker>>();

  useEffect(() => {
    const worker = new MWorker();
    muworker.current = Comlink.wrap<MupdfWorker>(worker);
    worker.addEventListener('message', (event: MessageEvent) => {
      if (event.data === 'mupdf::init') {
        setStarted(true);
      }
    });
    return () => worker.terminate();
  }, []);

  const loadDocument = useCallback((data: ArrayBuffer) => {
    document.current = data;
    return muworker.current!.loadDocument(data);
  }, []);

  const getPageCount = useCallback(() => {
    if (!document.current) throw new Error('Document not loaded');
    return muworker.current!.getPageCount();
  }, []);

  const renderPage = useCallback((index: number) => {
    if (!document.current) throw new Error('Document not loaded');
    const scale = (window.devicePixelRatio * 96) / 72;
    return muworker.current!.renderPageAsImage(index, scale);
  }, []);

  return {
    started,
    loadDocument,
    getPageCount,
    renderPage,
  };
}
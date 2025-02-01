/// <reference lib="webworker" />

import * as Comlink from 'comlink';
import * as mupdfjs from 'mupdf/mupdfjs';
import type {PDFDocument} from 'mupdf/mupdfjs';

export class MupdfWorker {
  private data?: ArrayBuffer;
  private cache = new Map<number, Uint8Array>();
  private document?: PDFDocument;

  constructor() {
    this.initializeMupdf();
  }

  private initializeMupdf() {
    try {
      postMessage('MUPDF_STARTED');
    } catch (error) {
      console.error('Failed to initialize MuPDF:', error);
    }
  }

  getPageCount(): number {
    if (!this.document) throw new Error('Document not loaded');
    return this.document.countPages();
  }

  loadDocument(data: ArrayBuffer): boolean {
    this.data = data;
    this.document = mupdfjs.PDFDocument.openDocument(data, 'application/pdf');
    return true;
  }

  reloadDocument() {
    if (!this.data) throw new Error('Document data not loaded');
    if (!this.document) throw new Error('Document not loaded');
    if (this.document.countPages() === 0) {
      this.document.destroy();
      this.document = mupdfjs.PDFDocument.openDocument(this.data, 'application/pdf');
    }
  }

  renderPageAsImage(index = 0, scale = 1): Uint8Array {
    const cached = this.cache.get(index);
    if (cached) return cached;
    if (!this.document) throw new Error('Document not loaded');
    this.document.abandonOperation();
    this.reloadDocument(); // Needed to work around a bug in MuPDF
    const page = this.document.loadPage(index);
    const pixmap = page.toPixmap(
      [scale, 0, 0, scale, 0, 0],
      mupdfjs.ColorSpace.DeviceRGB
    );
    const png = pixmap.asPNG();
    this.cache.set(index, png);
    pixmap.destroy();
    page.destroy();
    return png;
  }
}

Comlink.expose(new MupdfWorker());

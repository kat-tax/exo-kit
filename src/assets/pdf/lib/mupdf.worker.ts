/// <reference lib="webworker" />

import * as Comlink from 'comlink';
import * as mupdfjs from 'mupdf/mupdfjs';
import type * as MuPDF from 'mupdf/mupdfjs';

export const MUPDF_LOADED = 'MUPDF_LOADED';

export class MupdfWorker {
  private mupdf?: typeof MuPDF;
  private doc?: MuPDF.PDFDocument;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      this.mupdf = mupdfjs;
      postMessage(MUPDF_LOADED);
    } catch (err) {
      console.error('Failed to initialize MuPDF:', err);
    }
  }

  async load(document: ArrayBuffer): Promise<{pageCount: number}> {
    if (!this.mupdf)
      throw new Error('MuPDF not initialized');
    try {
      this.doc = this.mupdf.PDFDocument.openDocument(document, 'application/pdf');
      return {
        pageCount: this.doc?.countPages() ?? 0,
      }
    } catch (err) {
      console.error('Error loading document:', err);
      throw new Error('Failed to load document');
    }
  }

  async renderPage(index = 0, scale = 1): Promise<Uint8Array> {
    if (!this.mupdf || !this.doc)
      throw new Error('Document not loaded');
    try {
      const page = this.doc.loadPage(index);
      const pixmap = page.toPixmap(
        [scale, 0, 0, scale, 0, 0],
        this.mupdf.ColorSpace.DeviceRGB,
      );
      return pixmap.asPNG();
    } catch (err) {
      console.error('Error rendering page:', err);
      throw new Error('Failed to render page');
    }
  }
}

export default Comlink.expose(new MupdfWorker());

/// <reference lib="webworker" />

import * as Comlink from 'comlink';
import * as mupdfjs from 'mupdf/mupdfjs';
import type {PDFDocument} from 'mupdf/mupdfjs';

export class MupdfWorker {
  private data?: ArrayBuffer;
  private cache = new Map<number, Uint8Array>();
  private document?: PDFDocument;
  private isRendering = false;
  private renderQueue: Array<{
    index: number;
    scale: number;
    resolve: (result: Uint8Array) => void;
  }> = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      postMessage('mupdf::init');
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

  async renderPageAsImage(index = 0, scale = 1): Promise<Uint8Array> {
    const cached = this.cache.get(index);
    if (cached) return cached;

    // Create a promise that will be resolved when the page is rendered
    return new Promise((resolve) => {
      // Add the new request to the front of the queue
      this.renderQueue.unshift({index, scale, resolve});
      
      // Start processing the queue if not already running
      if (!this.isRendering) {
        this.processRenderQueue();
      }
    });
  }

  private async processRenderQueue(): Promise<void> {
    if (this.isRendering || this.renderQueue.length === 0) return;
    this.isRendering = true;
    try {
      while (this.renderQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 10));
        const {index, scale, resolve} = this.renderQueue.shift()!;
        if (!this.document) throw new Error('Document not loaded');
        this.reloadDocument();
        const page = this.document.loadPage(index);
        const pixmap = page.toPixmap(
          [scale, 0, 0, scale, 0, 0],
          mupdfjs.ColorSpace.DeviceRGB
        );
        const png = pixmap.asPNG();
        this.cache.set(index, png);
        pixmap.destroy();
        page.destroy();
        resolve(png);
      }
    } catch (error) {
      console.error('Error processing render queue:', error);
      this.renderQueue = [];
    } finally {
      this.isRendering = false;
    }
  }
}

Comlink.expose(new MupdfWorker());

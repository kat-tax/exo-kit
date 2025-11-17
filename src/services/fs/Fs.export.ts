import {FSService} from './Fs';

export type * from './Fs.interface';
export * as web from './lib/utils/web';
export * as posix from './lib/core/posix';

export const FS = new FSService();

export const watch = FS.watch;

export const pick = FS.pick;
export const pickDirectory = FS.pickDirectory;

export const hash = FS.hash;
export const cancelHash = FS.cancelHash;

export const isTextFile = FS.isTextFile;
export const importFiles = FS.importFiles;
export const getDiskSpace = FS.getDiskSpace;

/**
 * Converts a number of bytes to a human-readable string.
 * @param bytes The number of bytes to convert.
 * @param scale The scale to use (1000 or 1024) default is 1000.
 * @returns A human-readable string.
 */
export function bytesize(bytes: number, scale: 1000 | 1024 = 1000): string {
  const a = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let b = bytes;
  let u = 0;
  while (b >= scale || -b >= scale) {b /= scale; u++}
  return `${u ? b.toFixed(1) : b} ${a[u]}`;
}

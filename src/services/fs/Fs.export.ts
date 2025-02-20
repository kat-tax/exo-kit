import {FSService} from './Fs';

export type * from './Fs.interface';
export * as web from './lib/utils/web';

export const FS = new FSService();

export const init = FS.init;
export const watch = FS.watch;

export const pick = FS.pick;
export const pickDirectory = FS.pickDirectory;

export const hash = FS.hash;
export const cancelHash = FS.cancelHash;

export const isTextFile = FS.isTextFile;
export const importFiles = FS.importFiles;
export const getDiskSpace = FS.getDiskSpace;

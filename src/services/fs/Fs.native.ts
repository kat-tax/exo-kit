import {hfs} from './lib/core/plugins/NativeHfs';
// import ipfs from './lib/core/plugins/IpfsHfs';
import {FileSystem} from 'react-native-file-access';
import {isText} from './lib/data';

import type {FSBase, FileSystemIn, HfsType, PickFilesOptions, PickDirectoryOptions} from './Fs.interface';

export class FSService implements FSBase {
  async init(type?: HfsType) {
    return type === 'ipfs' ? await hfs() : await hfs();
  }

  async watch(_path: string, _callback: (records: unknown[]) => void) {
    return () => {};
  }

  async pick(_options?: PickFilesOptions) {
    // TODO: https://github.com/react-native-documents/document-picker
    return [];
  }

  async pickDirectory(_options?: PickDirectoryOptions) {
    // TODO: https://github.com/react-native-documents/document-picker
    return [];
  }

  async hash(
    input: FileSystemIn,
    _progress?: (bytes: number, total: number) => void,
    _jobId?: number,
  ) {
    if (typeof input !== 'string')
      throw new Error('[hashFile] file input not supported on native');
    const cidPrefix = '1220'; // CID prefix for sha256
    const sha256 = await FileSystem.hash(input, 'SHA-256');
    return `${cidPrefix}${sha256}`;
  }

  async cancelHash(jobId: number) {
    // TODO: fork react-native-file-access
    console.log('[cancelHash] not implemented on native', jobId);
  }

  async isTextFile(name: string, buffer?: ArrayBuffer) {
    return isText(name, buffer);
  }

  async importFiles(_path: string, _files: Array<File>) {
    // No-op on native
  }

  async getDiskSpace() {
    const disk = await FileSystem.df();
    const total = disk.internal_total + (disk.external_total || 0);
    const free = disk.internal_free + (disk.external_free || 0);
    return {total, free, used: total - free};
  }
}

import Hasher from './lib/hash/WebHasher';
import {isText} from './lib/data';
import * as web from './lib/utils/web';

import type {FSBase, FileSystemIn, HfsType, PickFilesOptions, PickDirectoryOptions} from './Fs.interface';
import type {HfsImpl} from './lib/core/hfs.types';

export class FSService implements FSBase {
  async init(backend: HfsType = 'local', token?: string): Promise<HfsImpl> {
    switch (backend) {
      case 'local':
        return (await import('./lib/core/backend/local')).mount();
      case 'ipfs':
        return (await import('./lib/core/backend/ipfs')).mount();
      case 'rmc':
        return (await import('./lib/core/backend/rmc')).mount(token);
      default:
        backend satisfies never;
    }
    throw new Error('Invalid backend');
  }

  async pick(options?: PickFilesOptions) {
    return web.pickFiles(options);
  }

  async pickDirectory(options?: PickDirectoryOptions) {
    return web.pickDirectory(options);
  }

  async hash(input: FileSystemIn, progress?: (bytes: number, total: number) => void, jobId?: number) {
    return await Hasher.start(input, progress, jobId);
  }

  async cancelHash(jobId: number) {
    return Hasher.cancel(jobId);
  }

  async isTextFile(name: string, buffer?: ArrayBuffer) {
    return isText(name, buffer);
  }

  async importFiles(path: string, files: Array<File>) {
    for (const file of files) {
      const rel = file.webkitRelativePath?.split('/')?.slice(0, -1)?.join('/');
      const dest = rel ? `${path}/${rel}` : path;
      const parent = dest
        ? await web.getDirectoryHandle(dest, {create: true})
        : await web.getRoot();
      if (!parent) continue;
      const target = await parent.getFileHandle(file.name, {create: true});
      if (!target) continue;
      const stream = await target.createWritable();
      if (!stream) continue;
      await file.stream().pipeTo(stream);
    }
  }

  async getDiskSpace() {
    const {quota, usage} = await navigator.storage.estimate();
    const total = quota || 0;
    const used = usage || 0;
    return {total, used, free: total - used};
  }

  async watch(path: string, callback: (records: unknown[]) => void) {
    try {
      // @ts-expect-error https://github.com/whatwg/fs/blob/main/proposals/FileSystemObserver.md
      const $ = new FileSystemObserver(async (records, observer) => {
        console.log('>> fs', records, observer);
        callback(records);
      });
      const root = await navigator.storage.getDirectory();
      const dir = !!path && await root.getDirectoryHandle(path);
      await $.observe(dir || root, {recursive: false});
      return $.disconnect as () => void;
    } catch (e) {
     console.error('>> fs [error]', e);
     return false;
    }
  }
}

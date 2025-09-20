import type {HfsImpl} from '../hfs.types';
import type {PosixFS} from './types';
import {Stat, ENOENT} from './models';

export const fs = (hfs: HfsImpl): PosixFS => {
  return {
    mkdir: async (filepath, _options) => {
      await hfs.createDirectory?.(filepath);
    },
    rmdir: async (filepath) => {
      await hfs.delete?.(filepath);
    },
    readdir: async (filepath) => {
      const entries: string[] = [];
      for await (const entry of hfs.list?.(filepath) ?? [])
        entries.push(entry.name);
      return entries;
    },
    readFile: async (filepath, _options) => {
      const bytes = await hfs.bytes?.(filepath);
      if (!bytes) {
        throw new ENOENT(`"${filepath}" not found.`);
      }
      return bytes;
    },
    writeFile: async (filepath, data, _options) => {
      await hfs.write?.(filepath, typeof data === 'string'
        ? new TextEncoder().encode(data)
        : data
      );
    },
    unlink: async (filepath) => {
      await hfs.delete?.(filepath);
    },
    rename: async (oldFilepath, newFilepath) => {
      await hfs.move?.(oldFilepath, newFilepath);
    },
    stat: async (filepath) => {
      return stat(hfs, filepath);
    },
    lstat: async (filepath) => {
      return stat(hfs, filepath);
    },
    symlink: async (_target, _filepath) => {
      // TODO: Implement
    },
    readlink: async (_filepath) => {
      // TODO: Implement
      return '';
    },
    backFile: async (_filepath, _options) => {
      // TODO: Implement
    },
    du: async (filepath) => {
      const size = await hfs.size?.(filepath);
      if (!size) {
        throw new ENOENT(`"${filepath}" not found.`);
      }
      return size;
    },
  };
};

async function stat(hfs: HfsImpl, filepath: string): Promise<Stat> {
  const type = await hfs.isFile?.(filepath) ? 'file' : 'dir';
  const size = await hfs.size?.(filepath);
  const lmod = await hfs.lastModified?.(filepath);
  const cmod = lmod; // TODO: Implement creation time in HFS
  return new Stat({
    type,
    size,
    mtimeMs: lmod?.getTime() ?? 0,
    ctimeMs: cmod?.getTime() ?? 0,
  });
}

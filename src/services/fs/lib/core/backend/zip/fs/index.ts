import {fs} from '@zip.js/zip.js';
import {Stat, ENOENT, ENOTDIR, EISDIR} from './models';

import type {ZipInput, ZipEntryInput, ReadFileOptions, WriteFileOptions} from './types';
import type {ZipDirectoryEntry} from '@zip.js/zip.js';
import type {FS} from '@zip.js/zip.js';

export class ZipFS {
  private zip: FS;

  constructor(src?: ZipInput) {
    this.zip = new fs.FS();
    if (src) this.mount(src);
  }

  /**
   * Mounts a source zip file.
   * @param src - The source to mount.
   * @throws {Error} If the source is invalid.
   */
  private async mount(src: ZipInput): Promise<void> {
    if (typeof src === 'string') {
      if (src.startsWith('data:')) {
        await this.zip.importData64URI(src);
      } else {
        await this.zip.importHttpContent(src);
      }
    } else if (src instanceof Uint8Array) {
      await this.zip.importUint8Array(src);
    } else if (src instanceof Blob) {
      await this.zip.importBlob(src);
    } else if (src instanceof ReadableStream) {
      await this.zip.importReadable(src);
    } else if (typeof src !== 'undefined') {
      throw new Error('Invalid source');
    }
  }

  /**
   * Looks up an entry in the zip file.
   * @param path - The path to the entry.
   * @returns The parent directory and the entry name.
   * @throws {ENOENT} If the entry is not found.
   */
  private lookup(path?: string): [ZipDirectoryEntry, string] {
    if (!path || path === '/' || path === '.')
      return [this.zip.root, ''];
    const parts = path.split('/');
    let cwd: ZipDirectoryEntry = this.zip.root;
    for (const part of parts.slice(0, -1)) {
      const child = cwd.getChildByName(part);
      if (child instanceof fs.ZipDirectoryEntry) {
        cwd = child;
      } else if (!child) {
        cwd = cwd.addDirectory(part);
      } else {
        throw new ENOTDIR(`"${part}" is not a directory`);
      }
    }
    return [cwd, parts.pop() ?? ''];
  }

  public async export(): Promise<string> {
    return await this.zip.exportData64URI();
  }
  
  /**
   * Reads a file from the zip file.
   * @param path - The path to the file.
   * @returns The file.
   * @throws {EISDIR} If the entry is not a file.
   * @throws {ENOENT} If the entry is not found.
   */
  public async readFile(path: string, options?: ReadFileOptions): Promise<Uint8Array | string> {
    console.log('>> readFile', path, options);
    const [dir, name] = this.lookup(path);
    const entry = dir.getChildByName(name);
    if (!entry)
      throw new ENOENT(`"${path}" not found`);
    if (!(entry instanceof fs.ZipFileEntry))
      throw new EISDIR(`"${path}" is not a file`);
    if (options?.encoding === 'utf8')
      return await entry.getText();
    return await entry.getUint8Array();
  }

  /**
   * Writes a file to the zip file.
   * @param path - The path to the file.
   * @param data - The data to write.
   * @throws {EISDIR} If the entry is not a file.
   * @throws {ENOENT} If the entry is not found.
   */
  public async writeFile(path: string, data: ZipEntryInput, options?: WriteFileOptions): Promise<void> {
    console.log('>> write', path, typeof data, data, options);
    const [dir, name] = this.lookup(path);
    const entry = dir.getChildByName(name);
    if (entry) {
      if (!(entry instanceof fs.ZipFileEntry))
        throw new EISDIR(`"${path}" is not a file`);
      if (typeof data === 'string') {
        entry.replaceText(data);
      } else if (data instanceof Uint8Array) {
        entry.replaceUint8Array(data);
      } else if (data instanceof Blob) {
        entry.replaceBlob(data);
      } else if (data instanceof ReadableStream) {
        entry.replaceReadable(data);
      } else {
        throw new Error('Invalid data');
      }
    } else {
      if (typeof data === 'string') {
        dir.addText(name, data);
      } else if (data instanceof Uint8Array) {
        dir.addUint8Array(name, data);
      } else if (data instanceof Blob) {
        dir.addBlob(name, data);
      } else if (data instanceof ReadableStream) {
        dir.addReadable(name, data);
      } else {
        throw new Error('Invalid data');
      }
    }
  }

  /**
   * Removes an entry from the zip file.
   * @param path - The path to the entry.
   * @throws {ENOENT} If the entry is not found.
   */
  public async unlink(path: string): Promise<void> {
    console.log('>> unlink', path);
    const [dir, name] = this.lookup(path);
    const entry = dir.getChildByName(name);
    if (!entry)
      throw new ENOENT(`"${path}" not found`);
    return this.zip.remove(entry);
  }

  /**
   * Reads a directory from the zip file.
   * @param path - The path to the directory.
   * @returns The directory.
   * @throws {ENOENT} If the entry is not found.
   */
  public async readdir(path: string): Promise<string[]> {
    console.log('>> readdir', path, this.zip.root);
    const [dir, name] = this.lookup(path);
    const entry = dir.getChildByName(name);
    if (!entry)
      throw new ENOENT(`"${path}" not found`);
    if (!(entry instanceof fs.ZipDirectoryEntry))
      throw new ENOTDIR(`"${path}" is not a directory`);
    return entry.children.map(child => child.getFullname());
  }

  /**
   * Creates a directory in the zip file.
   * @param path - The path to the directory.
   * @throws {ENOENT} If the entry is not found.
   */
  public async mkdir(path: string): Promise<ZipDirectoryEntry> {
    console.log('>> mkdir', path);
    const [dir, name] = this.lookup(path);
    return dir.addDirectory(name);
  }
  
  /**
   * Removes a directory from the zip file.
   * @param path - The path to the directory.
   * @throws {ErrorNotFound} If the entry is not found.
   */
  public async rmdir(path: string): Promise<void> {
    console.log('>> rmdir', path);
    const [dir, name] = this.lookup(path);
    const entry = dir.getChildByName(name);
    if (!entry)
      throw new ENOENT(`"${path}" not found`);
    return this.zip.remove(entry);
  }

  /**
   * Returns the stats of an entry in the zip file.
   * @param path - The path to the entry.
   * @returns The stats of the entry.
   * @throws {ErrorNotFound} If the entry is not found.
   */
  public async stat(path: string): Promise<Stat | false> {
    console.log('>> stat', path);
    const [dir, name] = this.lookup(path);
    const entry = dir.getChildByName(name);
    if (!entry)
      return false;
    return new Stat({
      ino: entry.id,
      type: entry.data?.directory ? 'dir' : 'file',
      mode: entry.data?.directory ? 0o755 : 0o644,
      size: entry.data?.uncompressedSize,
      mtimeMs: entry.data?.lastModDate.getTime(),
      ctimeMs: entry.data?.creationDate?.getTime(),
    });
  }
}

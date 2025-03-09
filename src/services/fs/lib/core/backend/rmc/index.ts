/**
 * @TODO
 * Lookup should have optional "create" flag, for write ops.
 * Write ops should be updated... obviously.
 * DeleteAll should be implemented.
 * CopyAll should be implemented.
 * MoveAll should be implemented.
 */

import {Hfs} from '../../hfs';
import {FileError, NotFoundError, NotEmptyError} from '../../hfs.utils';

import {remarkable} from 'rmapi-js';
import {Retrier} from '@humanwhocodes/retry';
import {uuid} from 'utilities/common/random';

import type {RemarkableApi, ResponseError, Entry} from 'rmapi-js';
import type {HfsImpl, HfsDirectoryEntry} from '../../hfs.types';

const REFRESH_ROOT = true;
const RETRY_ERROR_CODES = new Set(['ResponseError']);
const RETRY_STATUS_CODES = new Set([429, 408, 500, 502, 503, 504]);
const TXT_DECODER = new TextDecoder();

const AUTH_HOST = 'https://cors-proxy.ult.workers.dev/?url=https://webapp-prod.cloud.remarkable.engineering';
const RAW_HOST = 'https://cors-proxy.ult.workers.dev/?url=https://eu.tectonic.remarkable.com';

/**
 * A class representing the ReMarkable implementation of Hfs.
 */
export class RmcHfsImpl implements HfsImpl {
  #api: RemarkableApi;
  #items: Entry[];
  #retrier: Retrier;

  private async lookup(path: string): Promise<Entry | undefined> {
    let cwd: Entry | undefined;
    if (path === '/' || path === '' || path === '.') {
      const [hash] = await this.#api.raw.getRootHash();
      return this.#items?.find((e) => e.hash === hash);
    }
    for (const part of path.split('/')) {
      const parent = cwd?.id ?? '';
      const entry = this.#items?.find((e) =>
        e.parent === parent && e.visibleName === part);
      cwd = entry;
    }
    return cwd;
  }

  private async retry<T>(op: () => T | Promise<T>): Promise<T | undefined> {
    return this.#retrier.retry(op).catch((e: ResponseError) => {
      if (RETRY_STATUS_CODES.has(e.status))
        return undefined;
      throw e;
    });
  }

  /**
   * Creates a new instance.
   */
  constructor({root, items}: {
    root: RemarkableApi,
    items: Entry[],
  }) {
    this.#api = root;
    this.#items = items;
    this.#retrier = new Retrier((e: {code: string}) =>
      RETRY_ERROR_CODES.has(e.code));
  }

  /**
   * Reads a file and returns the contents as an Uint8Array.
   * @throws {FileError} If the file does not exist.
   */
  async bytes(filePath: string): Promise<Uint8Array | undefined> {
    const file = await this.lookup(filePath);
    if (!file || file.type !== 'DocumentType')
      throw new FileError(`bytes '${filePath}'`);
    return this.retry(() =>
      this.#api.raw.getHash(file.hash)
    );
  }

  /**
   * Writes a value to a file, creating any necessary directories along the way.
   * If the value is a string, UTF-8 encoding is used.
   * @throws {FileError} If the file does not exist.
   */
  async write(filePath: string, contents: Uint8Array | string): Promise<void> {
    const file = await this.lookup(filePath);
    if (file && file.type !== 'DocumentType')
      throw new FileError(`write '${filePath}'`);
    return this.retry(() => {
      const id = file?.id ?? uuid();
      if (typeof contents === 'string') {
        this.#api.raw.putText(id, contents);
      } else {
        this.#api.raw.putFile(id, contents);
      }
    });
  }

  /**
   * Appends a value to a file. If the value is a string, UTF-8 encoding is used.
   * @throws {FileError} If the file does not exist.
   */
  async append(filePath: string, contents: Uint8Array | string): Promise<void> {
    const file = await this.lookup(filePath);
    if (file && file.type !== 'DocumentType')
      throw new FileError(`append '${filePath}'`);
    const head = await this.bytes(filePath);
    return this.retry(() => {
      const id = file?.id ?? uuid();
      if (typeof contents === 'string') {
        const text = TXT_DECODER.decode(head);
        this.#api.raw.putText(id, text + contents);
      } else {
        const offset = head?.length ?? 0;
        const data = new Uint8Array(offset + contents.length);
        if (head) data.set(head);
        data.set(contents, offset);
        this.#api.raw.putFile(id, data);
      }
    });
  }

  /**
   * Checks if a file exists.
   */
  async isFile(filePath: string): Promise<boolean> {
    const file = await this.lookup(filePath);
    return file ? file.type === 'DocumentType' : false;
  }

  /**
   * Checks if a directory exists.
   */
  async isDirectory(dirPath: string): Promise<boolean> {
    const file = await this.lookup(dirPath);
    return file ? file.type === 'CollectionType' : false;
  }

  /**
   * Creates a directory recursively.
   * @throws {NotEmptyError} If the directory is not empty.
   */
  async createDirectory(dirPath: string): Promise<void> {
    const [dir, name] = dirPath.split('/').slice(0, -1);
    const parent = await this.lookup(dir);
    await this.retry(() =>
      this.#api.createFolder(name, {
        parent: parent?.id ?? '',
      }, REFRESH_ROOT)
    );
  }

  /**
   * Deletes a file or empty directory.
   * @throws {NotEmptyError} If the directory is not empty.
   * @throws {NotFoundError} If the file or directory does not exist.
   */
  async delete(filePath: string): Promise<boolean> {
    const file = await this.lookup(filePath);
    if (file?.type === 'CollectionType') {
      const list = await this.#api.raw.getEntries(file.hash);
      if (list.reduce((acc, item) => acc + item.subfiles, 0) > 0) {
        throw new NotEmptyError(`delete '${filePath}'`);
      }
    }
    if (!file)
      throw new NotFoundError(`delete '${filePath}'`);
    return Boolean(await this.retry(() =>
      this.#api.delete(file.hash, REFRESH_ROOT)
    ));
  }

  /**
   * Deletes a file or directory recursively.
   */
  async deleteAll(filePath: string): Promise<boolean> {
    // TODO: Implement
    return this.delete(filePath);
  }

  /**
   * Lists the files and directories in a directory.
   * @throws {NotFoundError} If the directory does not exist.
   */
  async *list(dirPath: string): AsyncIterable<HfsDirectoryEntry> {
    const dir = await this.lookup(dirPath);
    // Sanity check
    if (!dir || !dir.hash || dir.type !== 'CollectionType')
      throw new NotFoundError(`list '${dirPath}`);
    // Fetch entries
    const list = await this.retry(() =>
      this.#api.raw.getEntries(dir.hash)
    );
    for (const item of list ?? []) {
      // Lookup rM entry info
      const [content, metadata] = await Promise.all([
        this.#api.raw.getContent(item.hash),
        this.#api.raw.getMetadata(item.hash),
      ]);
      // Build HFS directory entry
      const {size, hash} = item;
      const {type, visibleName: name} = metadata;
      yield {
        size,
        hash,
        name,
        isFile: type === 'DocumentType',
        isSymlink: type === null,
        isDirectory: type === 'CollectionType',
        lastModified: new Date(metadata.lastModified),
        remarkable: {content, metadata},
      };
    }
  }

  /**
   * Returns the size of a file.
   */
  async size(filePath: string): Promise<number | undefined> {
    const file = await this.lookup(filePath);
    if (!file) return undefined;
    const list = await this.#api.raw.getEntries(file.hash);
    return list.reduce((acc, item) => acc + item.size, 0);
  }

  /**
   * Returns the last modified date of a file or directory. This method handles ENOENT errors
   * and returns undefined in that case.
   */
  async lastModified(fileOrDirPath: string): Promise<Date | undefined> {
    const file = await this.lookup(fileOrDirPath);
    if (!file) return undefined;
    return new Date(file?.lastModified ?? Date.now());
  }

  /**
   * Copies a file from one location to another.
   */
  async copy(source: string, destination: string): Promise<void> {
    await this.retry(() =>
      this.bytes(source).then(b => b &&
        this.write(destination, b)
      )
    );
  }

  /**
   * Copies a file or directory from one location to another.
   * @throws {NotFoundError} If the source file or directory does not exist.
   */
  async copyAll(source: string, destination: string): Promise<void> {
    // TODO: Implement
    const file = await this.lookup(source);
    if (!file) throw new NotFoundError(`copyAll '${source}'`);
    if (file.type === 'CollectionType') {
      const list = await this.#api.raw.getEntries(file.hash);
      for (const item of list) {
        await this.retry(async () => {
          const data = await this.#api.raw.getHash(item.hash);
          return this.#api.raw.putFile(uuid(), data);
        });
      }
    } else {
      return this.copy(source, destination);
    }
  }

  /**
   * Moves a file from the source path to the destination path.
   * @throws {NotFoundError} If the source file or destination file does not exist.
   */
  async move(source: string, destination: string): Promise<void> {
    const file = await this.lookup(source);
    const dest = await this.lookup(destination);
    if (!file) throw new NotFoundError(`move '${source}'`);
    if (!dest) throw new NotFoundError(`move '${destination}'`);
    await this.retry(() =>
      this.#api.move(file.hash, dest.id, REFRESH_ROOT)
    );
  }

  /**
   * Moves a file or directory from one location to another.
   * @throws {Error} If the source file or directory does not exist.
   */
  async moveAll(source: string, destination: string): Promise<void> {
    // TODO: Implement
    return this.move(source, destination);
  }
}

/**
 * A class representing a file system utility library.
 */
export class RmcHfs extends Hfs implements HfsImpl {
  constructor({root, items}: {root: RemarkableApi, items: Entry[]}) {
    super({impl: new RmcHfsImpl({root, items})});
  }
}

export const mount = async (token?: string) => {
  const root = await remarkable(token ?? '', {
    authHost: AUTH_HOST,
    rawHost: RAW_HOST,
  });
  const items = await root.listItems(REFRESH_ROOT);
  return new RmcHfs({root, items});
};

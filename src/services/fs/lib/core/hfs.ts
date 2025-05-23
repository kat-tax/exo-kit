// @ts-nocheck

import type {HfsImpl, HfsDirectoryEntry, HfsWalkEntry} from './hfs.types';
import * as _ from './hfs.utils';

/**
 * A class representing a file system utility library.
 */
export class Hfs implements HfsImpl {
  /** The base implementation for this instance. */
  #baseImpl: HfsImpl;
  /** The current implementation for this instance. */
  #impl: HfsImpl;
  /** A map of log names to their corresponding entries. */
  #logs: Map<string, Array<_.LogEntry>> = new Map();
  /** The decoder for the current implementation. */
  #decoder: TextDecoder;

  /**
   * Creates a new instance.
   * @param {object} options The options for the instance.
   * @param {HfsImpl} options.impl The implementation to use.
   */
  constructor({impl}: {impl: HfsImpl;}) {
    this.#baseImpl = impl;
    this.#impl = impl;
    this.#decoder = new TextDecoder();
  }

  /**
   * Logs an entry onto all currently open logs.
   * @param {string} methodName The name of the method being called.
   * @param {...*} args The arguments to the method.
   * @returns {void}
   */
  #log(methodName: string, ...args: any[]): void {
    for (const logs of this.#logs.values()) {
      logs.push(new _.LogEntry('call', { methodName, args }));
    }
  }

  /**
   * Starts a new log with the given name.
   * @param {string} name The name of the log to start;
   * @returns {void}
   * @throws {Error} When the log already exists.
   * @throws {TypeError} When the name is not a non-empty string.
   */
  logStart(name: string): void {
    if (!name || typeof name !== 'string') {
      throw new TypeError('Log name must be a non-empty string.');
    }

    if (this.#logs.has(name)) {
      throw new Error(`Log "${name}" already exists.`);
    }

    this.#logs.set(name, []);
  }

  /**
   * Ends a log with the given name and returns the entries.
   * @param {string} name The name of the log to end.
   * @returns {Array<LogEntry>} The entries in the log.
   * @throws {Error} When the log does not exist.
   */
  logEnd(name: string): Array<_.LogEntry> {
    if (this.#logs.has(name)) {
      const logs = this.#logs.get(name);
      this.#logs.delete(name);
      return logs;
    }

    throw new Error(`Log "${name}" does not exist.`);
  }

  /**
   * Determines if the current implementation is the base implementation.
   * @returns {boolean} True if the current implementation is the base implementation.
   */
  isBaseImpl(): boolean {
    return this.#impl === this.#baseImpl;
  }

  /**
   * Sets the implementation for this instance.
   * @param {object} impl The implementation to use.
   * @returns {void}
   */
  setImpl(impl: object): void {
    this.#log('implSet', impl);

    if (this.#impl !== this.#baseImpl) {
      throw new _.ImplAlreadySetError();
    }

    this.#impl = impl;
  }

  /**
   * Resets the implementation for this instance back to its original.
   * @returns {void}
   */
  resetImpl(): void {
    this.#log('implReset');
    this.#impl = this.#baseImpl;
  }

  /**
   * Asserts that the given method exists on the current implementation.
   * @param {string} methodName The name of the method to check.
   * @returns {void}
   * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
   */
  #assertImplMethod(methodName: string): void {
    if (typeof this.#impl[methodName] !== 'function') {
      throw new _.NoSuchMethodError(methodName);
    }
  }

  /**
   * Asserts that the given method exists on the current implementation, and if not,
   * throws an error with a different method name.
   * @param {string} methodName The name of the method to check.
   * @param {string} targetMethodName The name of the method that should be reported
   *  as an error when methodName does not exist.
   * @returns {void}
   * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
   */
  #assertImplMethodAlt(methodName: string, targetMethodName: string): void {
    if (typeof this.#impl[methodName] !== 'function') {
      throw new _.MethodNotSupportedError(targetMethodName);
    }
  }

  /**
   * Calls the given method on the current implementation.
   * @param {string} methodName The name of the method to call.
   * @param {...any} args The arguments to the method.
   * @returns {any} The return value from the method.
   * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
   */
  #callImplMethod(methodName: string, ...args: any[]): any {
    this.#log(methodName, ...args);
    this.#assertImplMethod(methodName);
    return this.#impl[methodName](...args);
  }

  /**
   * Calls the given method on the current implementation and doesn't log the call.
   * @param {string} methodName The name of the method to call.
   * @param {...any} args The arguments to the method.
   * @returns {any} The return value from the method.
   * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
   */
  #callImplMethodWithoutLog(methodName: string, ...args: any[]): any {
    this.#assertImplMethod(methodName);
    return this.#impl[methodName](...args);
  }

  /**
   * Calls the given method on the current implementation but logs a different method name.
   * @param {string} methodName The name of the method to call.
   * @param {string} targetMethodName The name of the method to log.
   * @param {...any} args The arguments to the method.
   * @returns {any} The return value from the method.
   * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
   */
  #callImplMethodAlt(methodName: string, targetMethodName: string, ...args: any[]): any {
    this.#log(targetMethodName, ...args);
    this.#assertImplMethodAlt(methodName, targetMethodName);
    return this.#impl[methodName](...args);
  }

  /**
   * Reads the given file and returns the contents as text. Assumes UTF-8 encoding.
   * @param {string|URL} filePath The file to read.
   * @returns {Promise<string|undefined>} The contents of the file.
   * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
   * @throws {TypeError} When the file path is not a non-empty string.
   */
  async text(filePath: string | URL): Promise<string | undefined> {
    _.assertValidFileOrDirPath(filePath);

    const result = await this.#callImplMethodAlt("bytes", "text", filePath);
    return result ? this.#decoder.decode(result) : undefined;
  }

  /**
   * Reads the given file and returns the contents as JSON. Assumes UTF-8 encoding.
   * @param {string|URL} filePath The file to read.
   * @returns {Promise<any|undefined>} The contents of the file as JSON.
   * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
   * @throws {SyntaxError} When the file contents are not valid JSON.
   * @throws {TypeError} When the file path is not a non-empty string.
   */
  async json(filePath: string | URL): Promise<any | undefined> {
    _.assertValidFileOrDirPath(filePath);

    const result = await this.#callImplMethodAlt("bytes", "json", filePath);
    return result ? JSON.parse(this.#decoder.decode(result)) : undefined;
  }

  /**
   * Reads the given file and returns the contents as an ArrayBuffer.
   * @param {string|URL} filePath The file to read.
   * @returns {Promise<ArrayBuffer|undefined>} The contents of the file as an ArrayBuffer.
   * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
   * @throws {TypeError} When the file path is not a non-empty string.
   * @deprecated Use bytes() instead.
   */
  async arrayBuffer(filePath: string | URL): Promise<ArrayBuffer | undefined> {
    _.assertValidFileOrDirPath(filePath);
    const result = await this.#callImplMethodAlt(
      "bytes",
      "arrayBuffer",
      filePath,
    );
    return result?.buffer;
  }

  /**
   * Reads the given file and returns the contents as an Uint8Array.
   * @param {string|URL} filePath The file to read.
   * @returns {Promise<Uint8Array|undefined>} The contents of the file as an Uint8Array.
   * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
   * @throws {TypeError} When the file path is not a non-empty string.
   */
  async bytes(filePath: string | URL): Promise<Uint8Array | undefined> {
    _.assertValidFileOrDirPath(filePath);
    return this.#callImplMethod("bytes", filePath);
  }

  /**
   * Writes the given data to the given file. Creates any necessary directories along the way.
   * If the data is a string, UTF-8 encoding is used.
   * @param {string|URL} filePath The file to write.
   * @param {string|ArrayBuffer|ArrayBufferView} contents The data to write.
   * @returns {Promise<void>} A promise that resolves when the file is written.
   * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
   * @throws {TypeError} When the file path is not a non-empty string.
   */
  async write(filePath: string | URL, contents: string | ArrayBuffer | ArrayBufferView): Promise<void> {
    _.assertValidFileOrDirPath(filePath);
    _.assertValidFileContents(contents);
    this.#log("write", filePath, contents);

    const value = _.toUint8Array(contents);
    return this.#callImplMethodWithoutLog("write", filePath, value);
  }

  /**
   * Appends the given data to the given file. Creates any necessary directories along the way.
   * If the data is a string, UTF-8 encoding is used.
   * @param {string|URL} filePath The file to append to.
   * @param {string|ArrayBuffer|ArrayBufferView} contents The data to append.
   * @returns {Promise<void>} A promise that resolves when the file is appended to.
   * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
   * @throws {TypeError} When the file path is not a non-empty string.
   * @throws {TypeError} When the file contents are not a string or ArrayBuffer.
   * @throws {Error} When the file cannot be appended to.
   */
  async append(filePath: string | URL, contents: string | ArrayBuffer | ArrayBufferView): Promise<void> {
    _.assertValidFileOrDirPath(filePath);
    _.assertValidFileContents(contents);
    this.#log("append", filePath, contents);

    const value = _.toUint8Array(contents);
    return this.#callImplMethodWithoutLog("append", filePath, value);
  }

  /**
   * Determines if the given file exists.
   * @param {string|URL} filePath The file to check.
   * @returns {Promise<boolean>} True if the file exists.
   * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
   * @throws {TypeError} When the file path is not a non-empty string.
   */
  async isFile(filePath: string | URL): Promise<boolean> {
    _.assertValidFileOrDirPath(filePath);
    return this.#callImplMethod("isFile", filePath);
  }

  /**
   * Determines if the given directory exists.
   * @param {string|URL} dirPath The directory to check.
   * @returns {Promise<boolean>} True if the directory exists.
   * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
   * @throws {TypeError} When the directory path is not a non-empty string.
   */
  async isDirectory(dirPath: string | URL): Promise<boolean> {
    _.assertValidFileOrDirPath(dirPath);
    return this.#callImplMethod("isDirectory", dirPath);
  }

  /**
   * Creates the given directory.
   * @param {string|URL} dirPath The directory to create.
   * @returns {Promise<void>} A promise that resolves when the directory is created.
   * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
   * @throws {TypeError} When the directory path is not a non-empty string.
   */
  async createDirectory(dirPath: string | URL): Promise<void> {
    _.assertValidFileOrDirPath(dirPath);
    return this.#callImplMethod("createDirectory", dirPath);
  }

  /**
   * Deletes the given file or empty directory.
   * @param {string|URL} filePath The file to delete.
   * @returns {Promise<boolean>} A promise that resolves when the file or
   *   directory is deleted, true if the file or directory is deleted, false
   *   if the file or directory does not exist.
   * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
   * @throws {TypeError} When the file path is not a non-empty string.
   */
  async delete(filePath: string | URL): Promise<boolean> {
    _.assertValidFileOrDirPath(filePath);
    return this.#callImplMethod("delete", filePath);
  }

  /**
   * Deletes the given file or directory recursively.
   * @param {string|URL} dirPath The directory to delete.
   * @returns {Promise<boolean>} A promise that resolves when the file or
   *   directory is deleted, true if the file or directory is deleted, false
   *   if the file or directory does not exist.
   * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
   * @throws {TypeError} When the directory path is not a non-empty string.
   */
  async deleteAll(dirPath: string | URL): Promise<boolean> {
    _.assertValidFileOrDirPath(dirPath);
    return this.#callImplMethod("deleteAll", dirPath);
  }

  /**
   * Returns a list of directory entries for the given path.
   * @param {string|URL} dirPath The path to the directory to read.
   * @returns {AsyncIterable<HfsDirectoryEntry>} A promise that resolves with the
   *   directory entries.
   * @throws {TypeError} If the directory path is not a string or URL.
   * @throws {Error} If the directory cannot be read.
   */
  async *list(dirPath: string | URL): AsyncIterable<HfsDirectoryEntry> {
    _.assertValidFileOrDirPath(dirPath);
    yield* await this.#callImplMethod("list", dirPath);
  }

  /**
   * Walks a directory using a depth-first traversal and returns the entries
   * from the traversal.
   * @param {string|URL} dirPath The path to the directory to walk.
   * @param {Object} [options] The options for the walk.
   * @param {(entry:HfsWalkEntry) => Promise<boolean>|boolean} [options.directoryFilter] A filter function to determine
   * 	if a directory's entries should be included in the walk.
   * @param {(entry:HfsWalkEntry) => Promise<boolean>|boolean} [options.entryFilter] A filter function to determine if
   * 	an entry should be included in the walk.
   * @returns {AsyncIterable<HfsWalkEntry>} A promise that resolves with the
   * 	directory entries.
   * @throws {TypeError} If the directory path is not a string or URL.
   * @throws {Error} If the directory cannot be read.
   */
  async *walk(
    dirPath: string | URL,
    { directoryFilter = () => true, entryFilter = () => true }: {directoryFilter?: (entry: HfsWalkEntry) => Promise<boolean> | boolean; entryFilter?: (entry: HfsWalkEntry) => Promise<boolean> | boolean;} = {},
  ): AsyncIterable<HfsWalkEntry> {
    _.assertValidFileOrDirPath(dirPath);
    this.#log("walk", dirPath, { directoryFilter, entryFilter });

    // inner function for recursion without additional logging
    const walk = async function* (
      dirPath,
      { directoryFilter, entryFilter, parentPath = "", depth = 1 },
    ) {
      let dirEntries: unknown[];

      try {
        dirEntries = await this.#callImplMethodWithoutLog(
          "list",
          dirPath,
        );
      } catch (error) {
        // if the directory does not exist then return an empty array
        if (error.code === "ENOENT") {
          return;
        }

        // otherwise, rethrow the error
        throw error;
      }

      for await (const listEntry of dirEntries) {
        const walkEntry = {
          path: listEntry.name,
          depth,
          ...listEntry,
        };

        if (parentPath) {
          walkEntry.path = `${parentPath}/${walkEntry.path}`;
        }

        // first emit the entry but only if the entry filter returns true
        let shouldEmitEntry = entryFilter(walkEntry);
        if (shouldEmitEntry.then) {
          shouldEmitEntry = await shouldEmitEntry;
        }

        if (shouldEmitEntry) {
          yield walkEntry;
        }

        // if it's a directory then yield the entry and walk the directory
        if (listEntry.isDirectory) {
          // if the directory filter returns false, skip the directory
          let shouldWalkDirectory = directoryFilter(walkEntry);
          if (shouldWalkDirectory.then) {
            shouldWalkDirectory = await shouldWalkDirectory;
          }

          if (!shouldWalkDirectory) {
            continue;
          }

          // make sure there's a trailing slash on the directory path before appending
          const directoryPath =
            dirPath instanceof URL
              ? new URL(
                  listEntry.name,
                  dirPath.href.endsWith("/")
                    ? dirPath.href
                    : `${dirPath.href}/`,
                )
              : `${dirPath.endsWith("/") ? dirPath : `${dirPath}/`}${listEntry.name}`;

          yield* walk(directoryPath, {
            directoryFilter,
            entryFilter,
            parentPath: walkEntry.path,
            depth: depth + 1,
          });
        }
      }
    }.bind(this);

    yield* walk(dirPath, { directoryFilter, entryFilter });
  }

  /**
   * Returns the size of the given file.
   * @param {string|URL} filePath The path to the file to read.
   * @returns {Promise<number>} A promise that resolves with the size of the file.
   * @throws {TypeError} If the file path is not a string or URL.
   * @throws {Error} If the file cannot be read.
   */
  async size(filePath: string | URL): Promise<number> {
    _.assertValidFileOrDirPath(filePath);
    return this.#callImplMethod("size", filePath);
  }

  /**
   * Returns the last modified timestamp of the given file or directory.
   * @param {string|URL} fileOrDirPath The path to the file or directory.
   * @returns {Promise<Date|undefined>} A promise that resolves with the last modified date
   *  or undefined if the file or directory does not exist.
   * @throws {TypeError} If the path is not a string or URL.
   */
  async lastModified(fileOrDirPath: string | URL): Promise<Date | undefined> {
    _.assertValidFileOrDirPath(fileOrDirPath);
    return this.#callImplMethod("lastModified", fileOrDirPath);
  }

  /**
   * Copys a file from one location to another.
   * @param {string|URL} source The path to the file to copy.
   * @param {string|URL} destination The path to the new file.
   * @returns {Promise<void>} A promise that resolves when the file is copied.
   * @throws {TypeError} If the file path is not a string or URL.
   * @throws {Error} If the file cannot be copied.
   */
  async copy(source: string | URL, destination: string | URL): Promise<void> {
    _.assertValidFileOrDirPath(source);
    _.assertValidFileOrDirPath(destination);
    return this.#callImplMethod("copy", source, destination);
  }

  /**
   * Copies a file or directory from one location to another.
   * @param {string|URL} source The path to the file or directory to copy.
   * @param {string|URL} destination The path to copy the file or directory to.
   * @returns {Promise<void>} A promise that resolves when the file or directory is
   * copied.
   * @throws {TypeError} If the directory path is not a string or URL.
   * @throws {Error} If the directory cannot be copied.
   */
  async copyAll(source: string | URL, destination: string | URL): Promise<void> {
    _.assertValidFileOrDirPath(source);
    _.assertValidFileOrDirPath(destination);
    return this.#callImplMethod("copyAll", source, destination);
  }

  /**
   * Moves a file from the source path to the destination path.
   * @param {string|URL} source The location of the file to move.
   * @param {string|URL} destination The destination of the file to move.
   * @returns {Promise<void>} A promise that resolves when the move is complete.
   * @throws {TypeError} If the file or directory paths are not strings.
   * @throws {Error} If the file or directory cannot be moved.
   */
  async move(source: string | URL, destination: string | URL): Promise<void> {
    _.assertValidFileOrDirPath(source);
    _.assertValidFileOrDirPath(destination);
    return this.#callImplMethod("move", source, destination);
  }

  /**
   * Moves a file or directory from one location to another.
   * @param {string|URL} source The path to the file or directory to move.
   * @param {string|URL} destination The path to move the file or directory to.
   * @returns {Promise<void>} A promise that resolves when the file or directory is
   * moved.
   * @throws {TypeError} If the source is not a string or URL.
   * @throws {TypeError} If the destination is not a string or URL.
   * @throws {Error} If the file or directory cannot be moved.
   */
  async moveAll(source: string | URL, destination: string | URL): Promise<void> {
    _.assertValidFileOrDirPath(source);
    _.assertValidFileOrDirPath(destination);
    return this.#callImplMethod("moveAll", source, destination);
  }
}

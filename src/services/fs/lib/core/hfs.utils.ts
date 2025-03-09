const encoder = new TextEncoder();

/**
 * Asserts that the given path is a valid file path.
 * @param fileOrDirPath The path to check.
 * @throws {TypeError} When the path is not a non-empty string.
 */
export function assertValidFileOrDirPath(fileOrDirPath: any): void {
  if (
    !fileOrDirPath ||
    (!(fileOrDirPath instanceof URL) && typeof fileOrDirPath !== 'string')
  ) {
    throw new TypeError('Path must be a non-empty string or URL.');
  }
}

/**
 * Asserts that the given file contents are valid.
 * @param contents The contents to check.
 * @throws {TypeError} When the contents are not a string or ArrayBuffer.
 */
export function assertValidFileContents(contents: any): void {
  if (
    typeof contents !== 'string' &&
    !(contents instanceof ArrayBuffer) &&
    !ArrayBuffer.isView(contents)
  ) {
    throw new TypeError(
      'File contents must be a string, ArrayBuffer, or ArrayBuffer view.',
    );
  }
}

/**
 * Converts the given contents to Uint8Array.
 * @param contents The data to convert.
 * @returns The converted Uint8Array.
 * @throws {TypeError} When the contents are not a string or ArrayBuffer.
 */
export function toUint8Array(contents: any): Uint8Array {
  if (contents instanceof Uint8Array) {
    return contents;
  }

  if (typeof contents === 'string') {
    return encoder.encode(contents);
  }

  if (contents instanceof ArrayBuffer) {
    return new Uint8Array(contents);
  }

  if (ArrayBuffer.isView(contents)) {
    const bytes = contents.buffer.slice(
      contents.byteOffset,
      contents.byteOffset + contents.byteLength,
    );
    return new Uint8Array(bytes);
  }
  throw new TypeError(
    'Invalid contents type. Expected string or ArrayBuffer.',
  );
}

/**
 * A class representing a log entry.
 */
export class LogEntry {
  /**
   * The type of log entry.
   * @type {string}
   */
  type: string;

  /**
   * The data associated with the log entry.
   * @type {any}
   */
  data: any;

  /**
   * The time at which the log entry was created.
   * @type {number}
   */
  timestamp: number = Date.now();

  /**
   * Creates a new instance.
   * @param {string} type The type of log entry.
   * @param {any} [data] The data associated with the log entry.
   */
  constructor(type: string, data: any) {
    this.type = type;
    this.data = data;
  }
}

/**
 * Error to represent when an impl is already set.
 */
export class ImplAlreadySetError extends Error {
  constructor() {
    super('Implementation already set.');
  }
}

/**
 * Error to represent when a method is missing on an impl.
 */
export class NoSuchMethodError extends Error {
  constructor(methodName: string) {
    super(`Method "${methodName}" does not exist on impl.`);
  }
}

/**
 * Error to represent when a method is not supported on an impl. This happens
 * when a method on `Hfs` is called with one name and the corresponding method
 * on the impl has a different name. (Example: `text()` and `bytes()`.)
 */
export class MethodNotSupportedError extends Error {
  constructor(methodName: string) {
    super(`Method "${methodName}" is not supported on this impl.`);
  }
}

/**
 * Error thrown when a file or directory is not found.
 */
export class NotFoundError extends Error {
  name = 'NotFoundError';
  code = 'ENOENT';
  constructor(message: string) {
    super(`ENOENT: No such file or directory, ${message}`);
  }
}

/**
 * Error thrown when an operation is not permitted.
 */
export class PermissionError extends Error {
  name = 'PermissionError';
  code = 'EPERM';
  constructor(message: string) {
    super(`EPERM: Operation not permitted, ${message}`);
  }
}

/**
 * Error thrown when an operation is not allowed on a directory.
 */
export class DirectoryError extends Error {
  name = 'DirectoryError';
  code = 'EISDIR';
  constructor(message: string) {
    super(`EISDIR: Illegal operation on a directory, ${message}`);
  }
}

/**
 * Error thrown when an operation is not allowed on a file.
 */
export class FileError extends Error {
  name = 'FileError';
  code = 'ENOTDIR';
  constructor(message: string) {
    super(`ENOTDIR: Illegal operation on a file, ${message}`);
  }
}

/**
 * Error thrown when a directory is not empty.
 */
export class NotEmptyError extends Error {
  name = 'NotEmptyError';
  code = 'ENOTEMPTY';
  constructor(message: string) {
    super(`ENOTEMPTY: Directory not empty, ${message}`);
  }
}

export class Path {
  /**
   * The steps in the path.
   */
  #steps: string[];

  /**
   * Creates a new instance.
   * @param steps The steps to use for the path.
   * @throws {TypeError} When steps is not iterable.
   */
  constructor(steps: Iterable<string> = []) {
    if (typeof steps[Symbol.iterator] !== 'function') {
      throw new TypeError('steps must be iterable');
    }
    this.#steps = [...steps];
    this.#steps.forEach(assertValidName);
  }

  /**
   * Adds steps to the end of the path.
   * @param steps The steps to add to the path.
   */
  push(...steps: string[]): void {
    steps.forEach(assertValidName);
    this.#steps.push(...steps);
  }

  /**
   * Removes the last step from the path.
   * @returns The last step in the path.
   */
  pop(): string | undefined {
    return this.#steps.pop();
  }

  /**
   * Returns an iterator for steps in the path.
   * @returns An iterator for the steps in the path.
   */
  steps(): IterableIterator<string> {
    return this.#steps.values();
  }

  /**
   * Returns an iterator for the steps in the path.
   * @returns An iterator for the steps in the path.
   */
  [Symbol.iterator](): IterableIterator<string> {
    return this.steps();
  }

  /**
   * Retrieves the name (the last step) of the path.
   */
  get name(): string {
    return this.#steps[this.#steps.length - 1];
  }

  /**
   * Sets the name (the last step) of the path.
   */
  set name(value: string) {
    assertValidName(value);
    this.#steps[this.#steps.length - 1] = value;
  }

  /**
   * Retrieves the size of the path.
   */
  get size(): number {
    return this.#steps.length;
  }

  /**
   * Returns the path as a string.
   * @returns The path as a string.
   */
  toString(): string {
    return this.#steps.join("/");
  }

  /**
   * Creates a new path based on the argument type. If the argument is a string,
   * it is assumed to be a file or directory path and is converted to a Path
   * instance. If the argument is a URL, it is assumed to be a file URL and is
   * converted to a Path instance. If the argument is a Path instance, it is
   * copied into a new Path instance. If the argument is an array, it is assumed
   * to be the steps of a path and is used to create a new Path instance.
   * @param pathish The value to convert to a Path instance.
   * @returns A new Path instance.
   * @throws {TypeError} When pathish is not a string, URL, Path, or Array.
   * @throws {TypeError} When pathish is a string and is empty.
   */
  static from(pathish: string | URL | Path | string[]): Path {
    if (typeof pathish === 'string') {
      if (!pathish) {
        throw new TypeError('argument cannot be empty');
      }
      return Path.fromString(pathish);
    }

    if (pathish instanceof URL) {
      return Path.fromURL(pathish);
    }

    if (pathish instanceof Path || Array.isArray(pathish)) {
      return new Path(pathish);
    }

    throw new TypeError('argument must be a string, URL, Path, or Array');
  }

  /**
   * Creates a new Path instance from a string.
   * @param fileOrDirPath The file or directory path to convert.
   * @returns A new Path instance.
   * @deprecated Use Path.from() instead.
   */
  static fromString(fileOrDirPath: string): Path {
    return new Path(normalizePath(fileOrDirPath).split("/"));
  }

  /**
   * Creates a new Path instance from a URL.
   * @param url The URL to convert.
   * @returns A new Path instance.
   * @throws {TypeError} When url is not a URL instance.
   * @throws {TypeError} When url.pathname is empty.
   * @throws {TypeError} When url.protocol is not "file:".
   * @deprecated Use Path.from() instead.
   */
  static fromURL(url: URL): Path {
    if (!(url instanceof URL)) {
      throw new TypeError('url must be a URL instance');
    }

    if (!url.pathname || url.pathname === '/') {
      throw new TypeError('url.pathname cannot be empty');
    }

    if (url.protocol !== 'file:') {
      throw new TypeError(`url.protocol must be "file:"`);
    }

    // Remove leading slash in pathname
    return new Path(normalizePath(url.pathname.slice(1)).split('/'));
  }
}

/**
 * Normalizes a path to use forward slashes.
 * @param filePath The path to normalize.
 * @returns The normalized path.
 */
function normalizePath(filePath: string): string {
  let startIndex = 0;
  let endIndex = filePath.length;
  if (/[a-z]:\//i.test(filePath))
    startIndex = 3;
  if (filePath.startsWith('./'))
    startIndex = 2;
  if (filePath.startsWith('/'))
    startIndex = 1;
  if (filePath.endsWith('/'))
    endIndex = filePath.length - 1;
  return filePath.slice(startIndex, endIndex).replace(/\\/g, '/');
}

/**
 * Asserts that the given name is a non-empty string, not equal to "." or "..",
 * and does not contain a forward slash or backslash.
 * @param name The name to check.
 * @throws {TypeError} When name is not valid.
 */
function assertValidName(name: string): void {
  if (typeof name !== 'string')
    throw new TypeError('name must be a string');
  if (!name)
    throw new TypeError('name cannot be empty');
  if (name === '.')
    throw new TypeError(`name cannot be "."`);
  if (name === '..')
    throw new TypeError(`name cannot be ".."`);
  if (name.includes('/') || name.includes('\\')) {
    throw new TypeError(
      `name cannot contain a slash or backslash: "${name}"`,
    );
  }
}

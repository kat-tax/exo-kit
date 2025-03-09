export class Stat {
  type: string;
  mode: number;
  size: number;
  mtimeMs: number;
  ctimeMs: number;
  ino: number;
  uid: number;
  gid: number;
  dev: number;
  constructor(stats: Partial<Stat>) {
    this.type = stats.type ?? 'file';
    this.mode = stats.mode ?? 0o644;
    this.size = stats.size ?? 0;
    this.mtimeMs = stats.mtimeMs ?? 0;
    this.ctimeMs = stats.ctimeMs || stats.mtimeMs || 0;
    this.ino = stats.ino ?? Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    this.uid = 1;
    this.gid = 1;
    this.dev = 1;
  }
  isFile() {
    return this.type === 'file';
  }
  isDirectory() {
    return this.type === 'dir';
  }
  isSymbolicLink() {
    return this.type === 'symlink';
  }
}

export const EEXIST = Fail('EEXIST');
export const ENOENT = Fail('ENOENT');
export const ENOTDIR = Fail('ENOTDIR');
export const ENOTEMPTY = Fail('ENOTEMPTY');
export const ETIMEDOUT = Fail('ETIMEDOUT');
export const EISDIR = Fail('EISDIR');

function Fail(name: string) {
  return class extends Error {
    code: string;
    // biome-ignore lint/suspicious/noExplicitAny: don't care
    constructor(...args: any[]) {
      super(...args);
      this.code = name;
      if (this.message) {
        this.message = `${name}: ${this.message}`;
      } else {
        this.message = name;
      }
    }
  };
}

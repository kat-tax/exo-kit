import {Path} from '../utils/path';

import type {
  FileSystemIn,
  FileSystemOut,
  PickFilesOptions,
  PickDirectoryOptions,
} from '../../Fs.interface';

let _root: FileSystemDirectoryHandle | undefined;

const HAS_FSA_PICKER = 'showDirectoryPicker' in window && (() => {
  try {return window.self === window.top} catch {return false;}
})();

export async function getRoot(): Promise<FileSystemDirectoryHandle> {
  if (!_root) {
    _root = await navigator.storage.getDirectory();
  }
  return _root;
}

export async function getFileHandle(
  path: string,
  opts?: FileSystemGetDirectoryOptions,
): Promise<FileSystemFileHandle | undefined> {
  const root = await getRoot();
  const steps = [...Path.from(path)];

  let cwd = root;
  let name = steps.shift();

  while (cwd && name) {
    if (steps.length > 0) {
      try {
        cwd = await cwd.getDirectoryHandle(name, opts);
      } catch {
        return undefined;
      }
    } else {
      try {
        return cwd.getFileHandle(name, opts);
      } catch {
        return undefined;
      }
    }
    name = steps.shift();
  }

  return undefined;
}

export async function getDirectoryHandle(
  path: string,
  opts?: FileSystemGetDirectoryOptions,
): Promise<FileSystemDirectoryHandle | undefined> {
  const root = await getRoot();
  const steps = [...Path.from(path)];
  let cwd = root;
  let name = steps.shift();

  while (cwd && name) {
    if (steps.length > 0) {
      try {
        cwd = await cwd.getDirectoryHandle(name, opts);
      } catch {
        return undefined;
      }
    } else {
      try {
        return cwd.getDirectoryHandle(name, opts);
      } catch {
        return undefined;
      }
    }
    name = steps.shift();
  }

  return undefined;
}

export async function getFileAccess(
  input: FileSystemIn,
  sync = false,
): Promise<[FileSystemOut, number]> {
  // Lookup path to get handle
  if (typeof input === 'string') {
    const handle = await getFileHandle(input);
    if (!handle) throw new Error('Unable to get file handle');
    const file = sync
      ? await handle.createSyncAccessHandle()
      : await handle.getFile();
    if (file instanceof File) {
      return [file, file.size];
    }
    return [file, file.getSize()];
  }

  // Given sync handle directly
  if (input instanceof FileSystemSyncAccessHandle) {
    return [input, input.getSize()];
  }

  // Given async handle directly
  return [input, input.size];
}

export async function getFileBuffer(
  input: FileSystemIn,
): Promise<ArrayBuffer> {
  const [file, size] = await getFileAccess(input);
  // Async access to File
  if (file instanceof File) {
    const buffer = await file.arrayBuffer();
    return buffer;
  }
  // Sync access to OPFS
  const buffer = new ArrayBuffer(size);
  file.read(buffer, {at: 0});
  file.close();
  return buffer;
}

export async function getFileEntries(
  handle: FileSystemDirectoryHandle,
  path = handle.name,
): Promise<Array<File>> {
  const _dirs: Promise<Array<File>>[] = [];
  const _files: Promise<Array<File>>[] = [];
  // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/_filesystemDirectoryHandle/values
  for await (const entry of handle.values()) {
    const relPath = path ? `${path}/${entry.name}` : '';
    if (entry.kind === 'file') {
      _files.push(entry.getFile().then((file: File) => relPath
        ? Object.defineProperty(file, 'webkitRelativePath', {
            enumerable: true,
            configurable: true,
            get: () => relPath,
          })
        : file
      ));
    } else if (entry.kind === 'directory') {
      _dirs.push(getFileEntries(entry as FileSystemDirectoryHandle, relPath));
    }
  }
  return [
    (await Promise.all(_dirs)).flat(),
    (await Promise.all(_files)),
  ].flat() as Array<File>;
}

export async function pickFiles(
  options?: PickFilesOptions,
): Promise<Array<File>> {
  if (!HAS_FSA_PICKER) return pickFallback('file', options?.multiple);
  let _files: Array<File> = [];
  try {
    // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker
    _files = getFileEntries(await showOpenFilePicker(options));
  } catch (err) {
    if (err instanceof Error && err.name !== 'AbortError') {
      return pickFallback('file', options?.multiple);
    }
  }
  return _files;
}

export async function pickDirectory(
  options?: PickDirectoryOptions,
): Promise<Array<File>> {
  if (!HAS_FSA_PICKER) return pickFallback('directory');
  let _files: Array<File> = [];
  try {
    // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker
    _files = getFileEntries(await showDirectoryPicker(options));
  } catch (err) {
    // If we error and it's not an abort, fallback
    if (err instanceof Error && err.name !== 'AbortError') {
      return pickFallback('directory');
    }
  }
  return _files;
}

export async function pickFallback(
  type: 'file' | 'directory',
  multiple = false,
): Promise<Array<File>> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = multiple;
    input.webkitdirectory = type === 'directory';
    input.addEventListener('change', () => resolve(Array.from(input.files ?? [])));
    if ('showPicker' in HTMLInputElement.prototype) {
      input.showPicker();
    } else {
      input.click();
    }
  });
}

export async function watchDirectory(
  path: string,
  callback: (records: unknown[]) => void,
) {
  try {
    // @ts-expect-error https://github.com/whatwg/fs/blob/main/proposals/FileSystemObserver.md
    const $ = new FileSystemObserver(async (e) => callback(e));
    const root = await getRoot();
    const dir = path ? await getDirectoryHandle(path) : root;
    await $.observe(dir, {recursive: false});
    return $.disconnect as () => void;
  } catch (e) {
   console.error('>> fs [error]', e);
   return false;
  }
}

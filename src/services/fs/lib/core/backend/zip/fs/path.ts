export function normalizePath(path: string): string {
  if (path.length === 0) return '.';
  let parts = splitPath(path);
  parts = parts.reduce(reducer, []);
  return joinPath(...parts);
}

export function resolvePath(...paths: string[]): string {
  let result = '';
  for (const path of paths) {
    if (path.startsWith('/')) {
      result = path;
    } else {
      result = normalizePath(joinPath(result, path));
    }
  }
  return result;
}

export function joinPath(...parts: string[]): string {
  if (parts.length === 0) return '';
  const path = parts.join('/');
  return path.replace(/\/{2,}/g, '/');
}

export function splitPath(path: string): string[] {
  if (path.length === 0) return [];
  if (path === '/') return ['/'];
  const parts = path.split('/');
  if (parts[parts.length - 1] === '')
    parts.pop();
  if (path[0] === '/') {
    parts[0] = '/';
  } else if (parts[0] !== '.') {
    parts.unshift('.');
  }
  return parts;
}

export function dirname(path: string): string {
  const last = path.lastIndexOf('/');
  if (last === -1)
    throw new Error(`Cannot get dirname of "${path}"`);
  if (last === 0)
    return '/';
  return path.slice(0, last);
}

export function basename(path: string): string {
  if (path === '/')
    throw new Error(`Cannot get basename of "${path}"`);
  const last = path.lastIndexOf('/');
  if (last === -1)
    return path;
  return path.slice(last + 1);
}

export function reducer(ancestors: string[], current: string): string[] {
  if (ancestors.length === 0) {
    ancestors.push(current);
    return ancestors;
  }
  if (current === '.')
    return ancestors;
  if (current === '..') {
    if (ancestors.length === 1) {
      if (ancestors[0] === '/') {
        throw new Error('Unable to normalize path - traverses above root directory');
      }
      if (ancestors[0] === '.') {
        ancestors.push(current);
        return ancestors;
      }
    }
    if (ancestors[ancestors.length - 1] === '..') {
      ancestors.push('..');
    } else {
      ancestors.pop();
    }
    return ancestors;
  }
  ancestors.push(current);
  return ancestors;
}

import url from 'url';
import { app } from 'electron';
import * as remote from '@electron/remote/main';
import { resolve } from 'path';

export const isURL = (s) => {
  const pattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;

  if (pattern.test(s)) {
    return true;
  }

  return pattern.test(`http://${s}`);
};

export const first = (input) => {
  if (typeof input !== 'string' && !Array.isArray(input)) {
    return undefined;
  }

  return [...input].splice(0, 1)[0];
};

export const last = (input) => {
  if (typeof input !== 'string' && !Array.isArray(input)) {
    return undefined;
  }

  return [...input].splice(-1)[0];
};

export const is = {
  get dev() {
    return process.env.NODE_ENV === 'development';
  },
  get main() {
    return process.type === 'browser';
  },
  get renderer() {
    return process.type === 'renderer';
  },
};

export const getRendererPath = (...paths) => {
  if (is.dev) {
    return `http://localhost:8080/${paths.join('/')}`;
  }

  return url.format({
    protocol: 'file',
    slashes: true,
    pathname: resolve(__dirname, ...paths),
  });
};

export const getPreload = (name) =>
  `${is.main ? app.getAppPath() : remote.app.getAppPath()}/dist/${name}-preload.bundle.js`;

export const defer =
  typeof setImmediate === 'function'
    ? setImmediate
    : (callback, ...args) => {
        process.nextTick(callback.bind.apply(callback, ...args));
      };

export const getPath = (...relativePaths) => {
  let path;

  if (process.type === 'renderer') {
    path = remote.app.getPath('userData');
  } else {
    path = app.getPath('userData');
  }

  if (is.dev) {
    path = process.cwd();
  }

  return resolve(path, ...relativePaths).replace(/\\g/, '/');
};

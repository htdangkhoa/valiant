import url from 'url';
import path from 'path';

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

export const getRendererPath = () => {
  if (is.dev) {
    return 'http://localhost:8080';
  }

  return url.format({
    protocol: 'file',
    slashes: true,
    pathname: path.resolve(__dirname, 'index.html'),
  });
};

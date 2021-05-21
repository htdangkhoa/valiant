import path from 'path';
import Datastore from 'nedb';
import { remote, app } from 'electron';

export * from './promise';

const getPath = (...relativePaths) => {
  let $path;

  if (process.type === 'renderer') {
    $path = remote.app.getPath('userData');
  } else {
    $path = app.getPath('userData');
  }

  if (process.env === 'development') {
    $path = process.cwd();
  }

  return path.resolve($path, ...relativePaths).replace(/\\g/, '/');
};

const createDatabase = (name) => new Datastore({ filename: getPath(`storages/${name}`), autoload: true });

export const History = createDatabase('histories');

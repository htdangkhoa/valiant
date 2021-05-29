import Datastore from 'nedb';
import { getPath } from 'common';

export * from './promise';

const createDatabase = (name) => new Datastore({ filename: getPath(`storages/${name}`), autoload: true });

export const History = createDatabase('histories');

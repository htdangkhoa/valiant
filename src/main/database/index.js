import Datastore from 'nedb';
import { getPath } from 'common';
import { decrypt, encrypt } from './secure';

export * as operator from './promise';

const whiteListKeys = ['createdAt', 'updatedAt'];

const createDatabase = (name, callback) => {
  const db = new Datastore({
    filename: getPath(`storages/${name}`),
    autoload: true,
    timestampData: true,
    afterSerialization: (line) => {
      try {
        const data = JSON.parse(line);

        Object.entries(data).forEach(([key, value]) => {
          if (!whiteListKeys.includes(key)) {
            data[key] = encrypt(value);
          }
        });

        return JSON.stringify(data);
      } catch (error) {
        return line;
      }
    },
    beforeDeserialization: (line) => {
      try {
        const data = JSON.parse(line);

        Object.entries(data).forEach(([key, value]) => {
          if (!whiteListKeys.includes(key)) {
            data[key] = decrypt(value);
          }
        });

        return JSON.stringify(data);
      } catch (error) {
        return line;
      }
    },
  });

  if (typeof callback === 'function') callback(db);

  return db;
};

export const History = createDatabase('histories', (db) => {
  ['title', 'url'].forEach((fieldName) => db.ensureIndex({ fieldName }));
});

export const Permission = createDatabase('permissions', (db) => {
  ['hostname', 'permission'].forEach((fieldName) => db.ensureIndex({ fieldName }));
});

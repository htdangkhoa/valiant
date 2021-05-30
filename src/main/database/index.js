import Datastore from 'nedb';
import { getPath } from 'common';
import { decrypt, encrypt } from './secure';

export * from './promise';

const whiteListKeys = ['createdAt', 'updatedAt'];

const createDatabase = (name) =>
  new Datastore({
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

export const History = createDatabase('histories');

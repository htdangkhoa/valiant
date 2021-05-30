export const insert = (store, doc) =>
  new Promise((resolve, reject) =>
    store.insert(doc, (error, newDoc) => {
      if (error) return reject(error);

      return resolve(newDoc);
    }),
  );

export const find = (store, query, projection) =>
  new Promise((resolve, reject) => {
    const callback = (error, document) => {
      if (error) return reject(error);

      return resolve(document);
    };

    if (projection) {
      return store.find(query, projection, callback);
    }

    return store.find(query, callback);
  });

export const findOne = (store, query, projection) =>
  new Promise((resolve, reject) => {
    const callback = (error, document) => {
      if (error) return reject(error);

      return resolve(document);
    };

    if (projection) {
      return store.findOne(query, projection, callback);
    }

    return store.findOne(query, callback);
  });

export const update = (
  store,
  query,
  updateQuery,
  options = { multi: false, upsert: false, returnUpdatedDocs: false },
) =>
  new Promise((resolve, reject) => {
    const opts = Object.assign({}, options);

    return store.update(query, updateQuery, opts, (...args) => {
      const [error, numberOfUpdated] = args;

      if (error) return reject(error);

      store.persistence.compactDatafile();

      if (args.length === 4) {
        const [, , affectedDocuments] = args;

        return resolve(affectedDocuments);
      }

      return resolve(numberOfUpdated);
    });
  });

export const remove = (store, query, options = { multi: false }) =>
  new Promise((resolve, reject) => {
    const opts = Object.assign({}, options);

    return store.remove(query, opts, (error, n) => {
      if (error) return reject(error);

      return resolve(n);
    });
  });

export const count = (store, query) =>
  new Promise((resolve, reject) =>
    store.count(query, (error, n) => {
      if (error) return reject(error);

      return resolve(n);
    }),
  );

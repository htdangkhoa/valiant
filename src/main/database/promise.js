export const insert = (store, doc) =>
  new Promise((resolve, reject) =>
    store.insert(doc, (error, newDoc) => {
      if (error) return reject(error);

      return resolve(newDoc);
    }),
  );

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

      if (args.length === 4) {
        const [, , affectedDocuments] = args;

        return resolve(affectedDocuments);
      }

      return resolve(numberOfUpdated);
    });
  });

export default (dbResponse) => {
  const structure = {};
  const defaultBrowseURL = [];

  Object.keys(dbResponse)
    .sort()
    .map((schema, s) => {
      structure[schema] = {};
      if (s === 0) defaultBrowseURL.push(schema);
      return Object.keys(dbResponse[schema])
        .sort()
        .map((table, t) => {
          if (t === 0 && s === 0) defaultBrowseURL.push(table);
          const thisTable = dbResponse[schema][table];
          const attributes = thisTable.attributes
            .filter((a) => ![thisTable.hash_attribute, '__createdtime__', '__updatedtime__'].includes(a.attribute))
            .map((a) => a.attribute)
            .sort();

          structure[schema][table] = {
            hashAttribute: thisTable.hash_attribute,
            newEntityColumns: {},
          };

          // generate new entity columns
          return attributes.filter((c) => !['__createdtime__', '__updatedtime__'].includes(c)).map((c) => (structure[schema][table].newEntityColumns[c] = null));
        });
    });

  return { structure, defaultBrowseURL: defaultBrowseURL.join('/') };
};
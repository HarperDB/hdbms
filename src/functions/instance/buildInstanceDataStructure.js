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
          return (structure[schema][table] = {
            record_count: dbResponse[schema][table].record_count,
            hashAttribute: dbResponse[schema][table].hash_attribute,
          });
        });
    });

  return {
    structure,
    defaultBrowseURL: defaultBrowseURL.join('/'),
  };
};

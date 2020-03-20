export default (dbResponse) => {
  const permissionStructure = {};

  Object.keys(dbResponse).map((schema) => {
    permissionStructure[schema] = { tables: {} };
    return Object.keys(dbResponse[schema]).map((table) => {
      const thisTable = dbResponse[schema][table];
      const attributes = thisTable.attributes.filter((a) => ![thisTable.hash_attribute, '__createdtime__', '__updatedtime__'].includes(a.attribute)).map((a) => a.attribute).sort();

      permissionStructure[schema].tables[table] = {
        read: true,
        insert: true,
        update: true,
        delete: true,
        attribute_restrictions: attributes.map((a) => ({
          attribute_name: a,
          read: true,
          insert: true,
          update: true,
          delete: true,
        })),
      };
    });
  });

  return permissionStructure;
};

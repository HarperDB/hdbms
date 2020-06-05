import describeAll from '../../api/instance/describeAll';

export default async ({ auth, url, currentRolePermissions }) => {
  const dbResponse = await describeAll({ auth, url });
  const permissionStructure = {};

  if (dbResponse.error) {
    return permissionStructure;
  }

  console.log(dbResponse, currentRolePermissions);

  Object.keys(dbResponse).map((schema) => {
    permissionStructure[schema] = {
      tables: {},
    };
    return Object.keys(dbResponse[schema]).map((table) => {
      const thisTable = dbResponse[schema][table];
      const extantTablePermissions = currentRolePermissions && currentRolePermissions[schema] && currentRolePermissions[schema].tables[table];

      const attributes = thisTable.attributes
        .filter((a) => ![thisTable.hash_attribute, '__createdtime__', '__updatedtime__'].includes(a.attribute))
        .map((a) => a.attribute)
        .sort();

      console.log(table, attributes);

      permissionStructure[schema].tables[table] = {
        read: extantTablePermissions ? extantTablePermissions.read : true,
        insert: extantTablePermissions ? extantTablePermissions.insert : true,
        update: extantTablePermissions ? extantTablePermissions.update : true,
        delete: extantTablePermissions ? extantTablePermissions.delete : true,
        attribute_restrictions: attributes.map((a) => {
          const extantAttributePermissions = extantTablePermissions?.attribute_restrictions?.find((att) => att.attribute_name === a);

          return {
            attribute_name: a,
            read: extantAttributePermissions ? extantAttributePermissions.read : extantTablePermissions ? extantTablePermissions.read : true,
            insert: extantAttributePermissions ? extantAttributePermissions.insert : extantTablePermissions ? extantTablePermissions.insert : true,
            update: extantAttributePermissions ? extantAttributePermissions.update : extantTablePermissions ? extantTablePermissions.update : true,
            delete: extantAttributePermissions ? extantAttributePermissions.delete : extantTablePermissions ? extantTablePermissions.delete : true,
          };
        }),
      };
      return true;
    });
  });

  return permissionStructure;
};

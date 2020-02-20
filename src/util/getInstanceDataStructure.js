import handleCellValues from './handleCellValues';

export default (dbResponse) => {
  const dbStructure = {};

  Object.keys(dbResponse).map((schema) => {
    dbStructure[schema] = {};
    return Object.keys(dbResponse[schema]).map((table) => {
      const thisTable = dbResponse[schema][table];
      const attributes = thisTable.attributes.filter((a) => a.attribute !== thisTable.hash_attribute).map((a) => a.attribute).sort();
      const orderedColumns = [thisTable.hash_attribute, ...attributes];

      dbStructure[schema][table] = {
        hashAttribute: thisTable.hash_attribute,
        newEntityColumns: {},
        dataTableColumns: orderedColumns.map((k) => ({
          Header: k.replace(/__/g, ''),
          accessor: k,
          style: { height: 29, paddingTop: 10 },
          Cell: (props) => handleCellValues(props.value),
        })),
      };

      // generate new entity columns
      return attributes.map((c) => dbStructure[schema][table].newEntityColumns[c] = null);
    });
  });

  return dbStructure;
};

import handleCellValues from './handleCellValues';

export default (dbResponse) => {
  const dbStructure = {};

  Object.keys(dbResponse).map((schema) => {
    dbStructure[schema] = {};
    return Object.keys(dbResponse[schema]).map((table) => {
      const thisTable = dbResponse[schema][table];
      const attributes = thisTable.attributes
        .filter((a) => ![thisTable.hash_attribute, '__createdtime__', '__updatedtime__'].includes(a.attribute))
        .map((a) => a.attribute)
        .sort();
      const orderedColumns = [thisTable.hash_attribute, ...attributes, '__createdtime__', '__updatedtime__'];

      dbStructure[schema][table] = {
        hashAttribute: thisTable.hash_attribute,
        newEntityColumns: {},
        dataTableColumns: orderedColumns.map((k) => ({
          Header: k.toString(),
          accessor: k.toString(),
          style: {
            height: 29,
            paddingTop: 10,
          },
          Cell: (props) => handleCellValues(props.value),
        })),
      };

      // generate new entity columns
      return attributes.filter((c) => !['__createdtime__', '__updatedtime__'].includes(c)).map((c) => (dbStructure[schema][table].newEntityColumns[c] = null));
    });
  });

  return dbStructure;
};

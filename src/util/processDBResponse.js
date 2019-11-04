import handleCellValues from './handleCellValues';

export default (dbResponse) => {
  const formattedDetails = {};

  Object.keys(dbResponse).map((schema) => {
    formattedDetails[schema] = {};
    Object.keys(dbResponse[schema]).map((table) => {
      const thisTable = dbResponse[schema][table];
      const attributes = thisTable.attributes.filter((a) => a.attribute !== thisTable.hash_attribute).map((a) => a.attribute).sort();
      const columns = [thisTable.hash_attribute, ...attributes];
      const columns_object = {};
      attributes.map((c) => columns_object[c] = null);

      formattedDetails[schema][table] = {};
      formattedDetails[schema][table].columns_object = columns_object;
      formattedDetails[schema][table].hash_attribute = thisTable.hash_attribute;
      formattedDetails[schema][table].columns = columns.map((k) => ({
        Header: k.replace(/__/g, ''),
        accessor: k,
        Cell: (props) => handleCellValues(props.value),
      }));
    });
  });

  return formattedDetails;
};

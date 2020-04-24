import sql from '../../api/instance/sql';
import handleCellValues from '../datatable/handleCellValues';

export default async ({ query, auth, url, signal }) => {
  let fetchError = false;
  let newTotalRecords = 0;
  let newData = [];
  let newDataTableColumns = [];

  try {
    newData = await sql({ sql: query, auth, url, signal });

    if (newData.error) {
      fetchError = newData.message;
    } else {
      newTotalRecords = newData.length;
      newDataTableColumns = newTotalRecords
        ? Object.keys(newData[0]).map((k) => ({
            Header: k.toString(),
            accessor: k.toString(),
            style: {
              height: 29,
              paddingTop: 10,
            },
            Cell: (props) => handleCellValues(props.value),
          }))
        : [];
    }
  } catch (e) {
    fetchError = e;
  }

  if (fetchError || !Array.isArray(newData) || newData.error) {
    return {
      newData: [],
      newTotalRecords,
      newDataTableColumns,
      newError: fetchError,
    };
  }

  return {
    newData: newData || [],
    newTotalRecords,
    newDataTableColumns,
  };
};

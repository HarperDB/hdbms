import sql from '../../api/instance/sql';
import handleCellValues from '../datatable/handleCellValues';

export default async ({ query, auth, url, signal }) => {
  try {
    const tableData = await sql({ sql: query, auth, url, signal });

    if (tableData.error) {
      return {
        message: tableData.message,
        error: true,
      };
    }

    if (tableData.message) {
      return {
        message: tableData.message,
      };
    }

    const totalRecords = tableData.length;
    const attributes = totalRecords ? Object.keys(tableData[0]) : [];
    const orderedColumns = attributes.filter((a) => !['__createdtime__', '__updatedtime__'].includes(a));
    if (attributes.includes('__createdtime__')) {
      orderedColumns.push('__createdtime__');
    }
    if (attributes.includes('__updatedtime__')) {
      orderedColumns.push('__updatedtime__');
    }
    const dataTableColumns = orderedColumns.map((k) => ({
      Header: k.toString(),
      accessor: k.toString(),
      style: {
        height: 29,
        paddingTop: 10,
      },
      Cell: (props) => handleCellValues(props.value),
    }));

    return {
      tableData,
      totalRecords,
      dataTableColumns,
    };
  } catch (e) {
    return {
      message: e,
      error: true,
    };
  }
};

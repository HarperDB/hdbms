import queryInstance from '../queryInstance';

export default async ({ schema, table, tableState, auth, url }) => {
  if (!tableState.sorted.length) return false;

  let fetchError = false;
  let newTotalPages = 1;
  let newTotalRecords = 0;
  let newData = [];

  try {
    let countSQL = `SELECT count(*) as newTotalRecords FROM ${schema}.${table} `;
    if (tableState.filtered.length) countSQL += `WHERE ${tableState.filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')} `;
    [{ newTotalRecords }] = await queryInstance({ operation: 'sql', sql: countSQL }, auth, url);
    newTotalPages = newTotalRecords && Math.ceil(newTotalRecords / tableState.pageSize);
  } catch (e) {
    // console.log('Failed to get row count');
    fetchError = true;
  }

  try {
    let dataSQL = `SELECT * FROM ${schema}.${table} `;
    if (tableState.filtered.length) dataSQL += `WHERE ${tableState.filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')} `;
    if (tableState.sorted.length) dataSQL += `ORDER BY \`${tableState.sorted[0].id}\` ${tableState.sorted[0].desc ? 'DESC' : 'ASC'}`;
    dataSQL += ` LIMIT ${tableState.page * tableState.pageSize + tableState.pageSize} OFFSET ${tableState.page * tableState.pageSize}`;
    newData = await queryInstance({ operation: 'sql', sql: dataSQL }, auth, url);
  } catch (e) {
    // console.log('Failed to get table data');
    fetchError = true;
  }

  const result = {
    tableData: [],
    totalPages: 1,
    totalRecords: 0,
  };

  if (fetchError) {
    return result;
  }

  if (newData) result.tableData = newData;
  if (newTotalPages) result.totalPages = newTotalPages;
  result.totalRecords = newTotalRecords;

  return result;
};

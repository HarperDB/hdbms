import queryHarperDB from './queryHarperDB';

export default async (db, connection, activeSchema, activeTable, setLoading, setTotalPages, pageSize, page, setTableData, onSortedChange, setColumns, filtered, sorted) => {
  setLoading(true);

  let countSQL = `SELECT count(*) FROM ${activeSchema}.${activeTable} `;
  if (filtered.length) countSQL += `WHERE ${filtered.map((f) => ` ${f.id} LIKE '%${f.value}%'`).join(' AND ')} `;

  const getTotalRecordCountOperation = { operation: 'sql', sql: countSQL };
  const totalPages = await queryHarperDB(connection, getTotalRecordCountOperation);

  try {
    setTotalPages(Math.ceil(totalPages[0]['COUNT(*)'] / pageSize));
  } catch (e) {
    // ;
  }

  let sql = `SELECT * FROM ${activeSchema}.${activeTable} `;
  if (filtered.length) sql += `WHERE ${filtered.map((f) => ` ${f.id} LIKE '%${f.value}%'`).join(' AND ')} `;
  if (sorted.length) sql += `ORDER BY ${sorted[0].id} ${sorted[0].desc ? 'DESC' : 'ASC'}`;
  sql += ` LIMIT ${(page * pageSize) + pageSize} OFFSET ${page * pageSize}`;

  const getTableDataOperation = { operation: 'sql', sql };
  const data = await queryHarperDB(connection, getTableDataOperation);
  setTableData(data);

  if (!sorted.length) {
    onSortedChange([{ id: db[activeSchema][activeTable].columns[0].accessor, desc: false }]);
  }

  setColumns(db[activeSchema][activeTable].columns);

  setLoading(false);
};

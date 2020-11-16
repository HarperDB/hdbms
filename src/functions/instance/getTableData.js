import describeTable from '../api/instance/describeTable';
import sql from '../api/instance/sql';

export default async ({ schema, table, filtered, pageSize, sorted, page, auth, url, signal }) => {
  let fetchError = false;
  let newTotalPages = 1;
  let newTotalRecords = 0;
  let newData = [];
  let allAttributes = false;
  let hashAttribute = false;

  try {
    const result = await describeTable({ auth, url, schema, table });

    if (result.error) {
      allAttributes = [];
      throw new Error('table');
    }

    const { record_count, attributes, hash_attribute } = result;
    allAttributes = attributes.map((a) => a.attribute);
    hashAttribute = hash_attribute;

    if (filtered.length) {
      const countSQL = `SELECT count(*) as newTotalRecords FROM \`${schema}\`.\`${table}\` WHERE ${filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')}`;
      [{ newTotalRecords }] = await sql({ auth, url, sql: countSQL });
    } else {
      newTotalRecords = record_count;
    }
    newTotalPages = newTotalRecords && Math.ceil(newTotalRecords / pageSize);
  } catch (e) {
    fetchError = e.message;
  }

  if (newTotalRecords) {
    try {
      let dataSQL = `SELECT * FROM \`${schema}\`.\`${table}\` `;
      if (filtered.length) dataSQL += `WHERE ${filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')} `;
      if (sorted.length) dataSQL += `ORDER BY \`${sorted[0].id}\` ${sorted[0].desc ? 'DESC' : 'ASC'}`;
      dataSQL += ` OFFSET ${page * pageSize} FETCH ${pageSize}`;

      newData = await sql({
        sql: dataSQL,
        auth,
        url,
        signal,
      });
      if (newData.error || !Array.isArray(newData)) {
        throw new Error(newData.message);
      }
    } catch (e) {
      fetchError = e.message;
    }
  }

  const orderedColumns = allAttributes.filter((a) => ![hashAttribute, '__createdtime__', '__updatedtime__'].includes(a)).sort();
  const newEntityAttributes = orderedColumns.reduce((ac, a) => ({ ...ac, [a]: null }), {});
  const dataTableColumns = [hashAttribute, ...orderedColumns, '__createdtime__', '__updatedtime__'].map((k) => ({
    Header: k.toString(),
    accessor: (row) => row[k.toString()],
  }));

  return {
    newData: newData || [],
    newTotalPages,
    newTotalRecords,
    newEntityAttributes,
    hashAttribute,
    dataTableColumns,
    error: fetchError === 'table' ? `You are not authorized to view ${schema}:${table}` : fetchError,
  };
};

import describeTable from '../api/instance/describeTable';
import sql from '../api/instance/sql';
import searchByValue from '../api/instance/searchByValue';
import searchByConditions from '../api/instance/searchByConditions';

export default async ({ schema, table, filtered, pageSize, sorted, page, auth, url, signal, signal2 }) => {
  let fetchError = false;
  let newTotalRecords = 0;
  let newTotalPages = 1;
  let newData = [];
  let allAttributes = false;
  let hashAttribute = false;
  const offset = page * pageSize;

  try {
    const result = await describeTable({ auth, url, schema, table, signal: signal2 });

    if (result.error) {
      allAttributes = [];
      throw new Error('table');
    }

    const { record_count, attributes, hash_attribute } = result;
    allAttributes = attributes.map((a) => a.attribute);
    hashAttribute = hash_attribute;
    newTotalRecords = record_count;
    newTotalPages = newTotalRecords && Math.ceil(newTotalRecords / pageSize);
  } catch (e) {
    fetchError = e.message;
  }

  if (newTotalRecords) {
    try {
      if (sorted.length) {
        let dataSQL = `SELECT * FROM \`${schema}\`.\`${table}\` `;
        if (filtered.length) dataSQL += `WHERE ${filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')} `;
        if (sorted.length) dataSQL += `ORDER BY \`${sorted[0].id}\` ${sorted[0].desc ? 'DESC' : 'ASC'}`;
        dataSQL += ` OFFSET ${offset} FETCH ${pageSize}`;

        newData = await sql({
          sql: dataSQL,
          auth,
          url,
          signal,
        });
      } else if (filtered.length) {
        newData = await searchByConditions({
          schema,
          table,
          operator: 'and',
          get_attributes: ['*'],
          limit: pageSize,
          offset,
          conditions: filtered.map((f) => ({ search_attribute: f.id, search_type: 'contains', search_value: f.value })),
          auth,
          url,
          signal,
        });
      } else {
        newData = await searchByValue({
          schema,
          table,
          search_attribute: hashAttribute,
          search_value: '*',
          get_attributes: ['*'],
          limit: pageSize,
          offset,
          auth,
          url,
          signal,
        });
      }
      if (newData.error || !Array.isArray(newData)) {
        throw new Error(newData.message);
      }
    } catch (e) {
      fetchError = e.message;
    }
  }

  // sort columns, but keep primary key / hash attribute first, and created and updated last.
  // NOTE: __created__ and __updated__ might not exist in the schema, only include if they exist.
  const orderedColumns = allAttributes.filter((a) => ![hashAttribute, '__createdtime__', '__updatedtime__'].includes(a)).sort();
  const newEntityAttributes = orderedColumns.reduce((ac, a) => ({ ...ac, [a]: null }), {});

  if (allAttributes.includes('__createdtime__')) orderedColumns.push('__createdtime__');
  if (allAttributes.includes('__updatedtime__')) orderedColumns.push('__updatedtime__');

  const dataTableColumns = (hashAttribute ? [ hashAttribute, ...orderedColumns ] : [ ...orderedColumns ]).map((k) => ({
    Header: k.toString(),
    accessor: (row) => row[k.toString()],
  }));

  return {
    newData: newData || [],
    newEntityAttributes,
    newTotalRecords,
    newTotalPages,
    hashAttribute,
    dataTableColumns,
    error: fetchError === 'table' ? `You are not authorized to view ${schema}:${table}` : fetchError,
  };
};

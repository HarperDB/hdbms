import queryInstance from '../../api/queryInstance';
import describeTable from '../../api/instance/describeTable';
import handleCellValues from '../datatable/handleCellValues';

export default async ({ schema, table, filtered, pageSize, sorted, page, auth, url, signal }) => {
  let fetchError = false;
  let newTotalPages = 1;
  let newTotalRecords = 0;
  let newData = [];
  let allAttributes = false;
  let hashAttribute = false;
  const newEntityAttributes = {};

  try {
    const result = await describeTable({ auth, url, schema, table, signal });

    if (result.error) {
      allAttributes = [];
      throw new Error('table');
    }

    const { record_count, attributes, hash_attribute } = result;
    allAttributes = attributes.map((a) => a.attribute);
    hashAttribute = hash_attribute;

    if (!sorted.length || !allAttributes.includes(sorted[0].id)) {
      sorted = [{ id: hash_attribute, desc: false }];
    }

    if (filtered.length) {
      const countSQL = `SELECT count(*) as newTotalRecords FROM \`${schema}\`.\`${table}\` WHERE ${filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')}`;
      [{ newTotalRecords }] = await queryInstance({ operation: 'sql', sql: countSQL }, auth, url, signal);
    } else {
      newTotalRecords = record_count;
    }

    newTotalPages = newTotalRecords && Math.ceil(newTotalRecords / pageSize);
  } catch (e) {
    fetchError = e;
  }

  if (newTotalRecords) {
    try {
      let dataSQL = `SELECT * FROM \`${schema}\`.\`${table}\` `;
      if (filtered.length) dataSQL += `WHERE ${filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')} `;
      if (sorted.length) dataSQL += `ORDER BY \`${sorted[0].id}\` ${sorted[0].desc ? 'DESC' : 'ASC'}`;
      dataSQL += ` OFFSET ${page * pageSize} FETCH ${pageSize}`;

      newData = await queryInstance({ operation: 'sql', sql: dataSQL }, auth, url, signal);

      if (newData.error || !Array.isArray(newData)) {
        throw new Error(newData.message || 'Unable to fetch the requested data');
      }
    } catch (e) {
      // console.log('Failed to get table data', e);
      fetchError = e;
    }
  }

  if (newData.access_errors && newData.access_errors.find((e) => e.type === 'attribute')) {
    allAttributes = allAttributes.filter((a) => !newData.access_errors.find((e) => e.type === 'attribute' && e.entity.toString() === a.toString()));
    const selectString = allAttributes.map((a) => `\`${a}\``).join(', ');

    try {
      let dataSQL = `SELECT ${selectString} FROM \`${schema}\`.\`${table}\` `;
      if (filtered.length) dataSQL += `WHERE ${filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')} `;
      if (sorted.length) dataSQL += `ORDER BY \`${sorted[0].id}\` ${sorted[0].desc ? 'DESC' : 'ASC'}`;
      dataSQL += ` OFFSET ${page * pageSize} FETCH ${pageSize}`;

      newData = await queryInstance({ operation: 'sql', sql: dataSQL }, auth, url, signal);
    } catch (e) {
      // console.log('Failed to get table data with specific attributes');
      fetchError = e;
    }
  }

  const orderedColumns = allAttributes.filter((a) => ![hashAttribute, '__createdtime__', '__updatedtime__'].includes(a)).sort();
  orderedColumns.map((k) => (newEntityAttributes[k] = null));
  orderedColumns.unshift(hashAttribute);
  orderedColumns.push('__createdtime__');
  orderedColumns.push('__updatedtime__');

  const dataTableColumns = orderedColumns.map((k) => ({
    id: k.toString(),
    Header: k.toString(),
    accessor: (row) => row[k.toString()],
    style: { height: 29, paddingTop: 10 },
    Cell: (props) => handleCellValues(props.value),
  }));

  return {
    newData: newData || [],
    newTotalPages,
    newTotalRecords,
    newEntityAttributes,
    hashAttribute,
    dataTableColumns,
    error: fetchError && fetchError.message === 'table' && `You are not authorized to view ${schema}:${table}`,
  };
};

import queryInstance from '../../api/queryInstance';
import describeTable from '../../api/instance/describeTable';
import handleCellValues from '../datatable/handleCellValues';

export default async ({ schema, table, filtered, pageSize, sorted, page, auth, url, signal, time }) => {
  let fetchError = false;
  let newTotalPages = 1;
  let newTotalRecords = 0;
  let newData = [];
  let allAttributes = false;
  let hashAttribute = false;
  const newEntityAttributes = {};

  try {
    const result = await describeTable({ auth, url, schema, table, signal });

    const { record_count, attributes, hash_attribute } = result;
    allAttributes = attributes.map((a) => a.attribute);
    hashAttribute = hash_attribute;

    if (!sorted.length) sorted.push({ id: hash_attribute, desc: false });

    if (filtered.length) {
      const countSQL = `SELECT count(*) as newTotalRecords FROM \`${schema}\`.\`${table}\` WHERE ${filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')}`;
      [{ newTotalRecords }] = await queryInstance({ operation: 'sql', sql: countSQL }, auth, url, signal);
    } else {
      newTotalRecords = record_count;
    }

    newTotalPages = newTotalRecords && Math.ceil(newTotalRecords / pageSize);
  } catch (e) {
    // console.log('Failed to get row count', e);
    fetchError = true;
  }

  if (newTotalRecords) {
    try {
      let dataSQL = `SELECT * FROM \`${schema}\`.\`${table}\` `;
      if (filtered.length) dataSQL += `WHERE ${filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')} `;
      if (sorted.length) dataSQL += `ORDER BY \`${sorted[0].id}\` ${sorted[0].desc ? 'DESC' : 'ASC'}`;
      dataSQL += ` OFFSET ${page * pageSize} FETCH ${pageSize}`;

      newData = await queryInstance({ operation: 'sql', sql: dataSQL }, auth, url, signal);
    } catch (e) {
      // console.log('Failed to get table data');
      fetchError = true;
    }
  }

  if (newData.attribute_error) {
    allAttributes = allAttributes.filter((a) => !newData.attribute_error.includes(a));
    const selectString = allAttributes.map((a) => `\`${a}\``).join(', ');

    try {
      let dataSQL = `SELECT ${selectString} FROM \`${schema}\`.\`${table}\` `;
      if (filtered.length) dataSQL += `WHERE ${filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')} `;
      if (sorted.length) dataSQL += `ORDER BY \`${sorted[0].id}\` ${sorted[0].desc ? 'DESC' : 'ASC'}`;
      dataSQL += ` OFFSET ${page * pageSize} FETCH ${pageSize}`;

      newData = await queryInstance({ operation: 'sql', sql: dataSQL }, auth, url, signal);
    } catch (e) {
      // console.log('Failed to get table data with specific attributes');
      fetchError = true;
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

  const result = {
    newData: [],
    newTotalPages,
    newTotalRecords,
    newEntityAttributes,
    hashAttribute,
    dataTableColumns,
  };

  if (fetchError || !Array.isArray(newData) || newData.error) {
    return result;
  }

  if (newData) result.newData = newData;

  return result;
};

import queryInstance from '../../api/queryInstance';
import describeTable from '../../api/instance/describeTable';
import handleCellValues from '../datatable/handleCellValues';

export default async ({ schema, table, filtered, pageSize, sorted, page, auth, url, signal, is_local, compute_stack_id, customer_id }) => {
  let fetchError = false;
  let newTotalPages = 1;
  let newTotalRecords = 0;
  let newData = [];
  let allAttributes = false;
  let hashAttribute = false;
  let newSorted = sorted;
  const newEntityAttributes = {};

  try {
    const result = await describeTable({ auth, url, schema, table, signal, is_local, compute_stack_id, customer_id });

    if (result.error) {
      allAttributes = [];
      throw new Error('table');
    }

    const { record_count, attributes, hash_attribute } = result;
    allAttributes = attributes.map((a) => a.attribute);
    hashAttribute = hash_attribute;

    if (!newSorted.length || !allAttributes.includes(newSorted[0].id)) {
      newSorted = [{ id: hash_attribute, desc: false }];
    }

    if (filtered.length) {
      const countSQL = `SELECT count(*) as newTotalRecords FROM \`${schema}\`.\`${table}\` WHERE ${filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')}`;
      [{ newTotalRecords }] = await queryInstance({ operation: 'sql', sql: countSQL }, auth, url, compute_stack_id, customer_id, signal);
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
      if (newSorted.length) dataSQL += `ORDER BY \`${newSorted[0].id}\` ${newSorted[0].desc ? 'DESC' : 'ASC'}`;
      dataSQL += ` OFFSET ${page * pageSize} FETCH ${pageSize}`;

      newData = await queryInstance({ operation: 'sql', sql: dataSQL }, auth, url, compute_stack_id, customer_id, signal);

      if (newData.error || !Array.isArray(newData)) {
        throw new Error(newData.message);
      }
    } catch (e) {
      fetchError = e.message;
    }
  }

  if (newData.access_errors && newData.access_errors.find((e) => e.type === 'attribute')) {
    allAttributes = allAttributes.filter((a) => !newData.access_errors.find((e) => e.type === 'attribute' && e.entity.toString() === a.toString()));
    const selectString = allAttributes.map((a) => `\`${a}\``).join(', ');

    try {
      let dataSQL = `SELECT ${selectString} FROM \`${schema}\`.\`${table}\` `;
      if (filtered.length) dataSQL += `WHERE ${filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')} `;
      if (newSorted.length) dataSQL += `ORDER BY \`${newSorted[0].id}\` ${newSorted[0].desc ? 'DESC' : 'ASC'}`;
      dataSQL += ` OFFSET ${page * pageSize} FETCH ${pageSize}`;

      newData = await queryInstance({ operation: 'sql', sql: dataSQL }, auth, url, compute_stack_id, customer_id, signal);

      if (newData.error || !Array.isArray(newData)) {
        throw new Error(newData.message);
      }
    } catch (e) {
      fetchError = e.message;
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

  console.log(newData);

  return {
    newData: newData || [],
    newTotalPages,
    newTotalRecords,
    newEntityAttributes,
    hashAttribute,
    dataTableColumns,
    newSorted,
    error: fetchError?.message === 'table' ? `You are not authorized to view ${schema}:${table}` : fetchError?.message,
  };
};

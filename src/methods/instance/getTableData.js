import queryInstance from '../../api/queryInstance';
import describeTable from '../../api/instance/describeTable';
import handleCellValues from '../datatable/handleCellValues';
import registrationInfo from '../../api/instance/registrationInfo';

export default async ({ schema, table, filtered, pageSize, sorted, page, auth, url, signal, is_local, compute_stack_id, customer_id }) => {
  let fetchError = false;
  let newTotalPages = 1;
  let newTotalRecords = 0;
  let newData = [];
  let allAttributes = false;
  let hashAttribute = false;
  let newSorted = sorted;
  const newEntityAttributes = {};
  let legacy;

  try {
    const { version } = await registrationInfo({ auth, url, compute_stack_id, customer_id });
    const [major, minor, patch] = version.split('.');
    legacy = version !== '2.0.000' && major <= 2 && minor <= 1 && patch <= 2;
  } catch (e) {
    legacy = true;
  }

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
      [{ newTotalRecords }] = await queryInstance(
        {
          operation: 'sql',
          sql: countSQL,
        },
        auth,
        url,
        compute_stack_id,
        customer_id,
        signal
      );
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

      newData = await queryInstance(
        {
          operation: 'sql',
          sql: dataSQL,
        },
        auth,
        url,
        compute_stack_id,
        customer_id,
        signal
      );
      if (newData.error || !Array.isArray(newData)) {
        throw new Error(newData.message);
      }
    } catch (e) {
      fetchError = e.message;
    }
  }

  const disallowedAttributes = newData.access_errors && newData.access_errors.filter((e) => e.type === 'attribute').map((e) => e.entity);
  if (disallowedAttributes?.length) {
    allAttributes = allAttributes.filter((a) => !disallowedAttributes.includes(a.toString()));
    const selectString = legacy ? allAttributes.map((a) => `\`${a}\``).join(', ') : '*';

    try {
      let dataSQL = `SELECT ${selectString} FROM \`${schema}\`.\`${table}\` `;
      if (filtered.length) dataSQL += `WHERE ${filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')} `;
      if (newSorted.length && !disallowedAttributes.includes(newSorted[0].id)) dataSQL += `ORDER BY \`${newSorted[0].id}\` ${newSorted[0].desc ? 'DESC' : 'ASC'}`;
      dataSQL += ` OFFSET ${page * pageSize} FETCH ${pageSize}`;
      newData = await queryInstance(
        {
          operation: 'sql',
          sql: dataSQL,
        },
        auth,
        url,
        compute_stack_id,
        customer_id,
        signal
      );
      if (newData.error || !Array.isArray(newData)) {
        throw new Error(newData.message);
      }
      fetchError = false;
    } catch (e) {
      fetchError = e.message;
    }
  }

  let dataTableColumns = [];
  if (Array.isArray(newData) && newData.length) {
    const orderedColumns = Object.keys(newData[0])
      .filter((a) => ![hashAttribute, '__createdtime__', '__updatedtime__'].includes(a))
      .sort();
    if (orderedColumns) {
      orderedColumns.map((k) => (newEntityAttributes[k] = null));
      if (Object.keys(newData[0]).includes(hashAttribute)) orderedColumns.unshift(hashAttribute);
      if (Object.keys(newData[0]).includes('__createdtime__')) orderedColumns.push('__createdtime__');
      if (Object.keys(newData[0]).includes('__updatedtime__')) orderedColumns.push('__updatedtime__');
      dataTableColumns = orderedColumns.map((k) => ({
        id: k.toString(),
        Header: k.toString(),
        accessor: (row) => row[k.toString()],
        style: { height: 29, paddingTop: 10 },
        Cell: (props) => handleCellValues(props.value),
      }));
    }
  }
  return {
    newData: newData || [],
    newTotalPages,
    newTotalRecords,
    newEntityAttributes,
    hashAttribute,
    dataTableColumns,
    newSorted,
    error: fetchError === 'table' ? `You are not authorized to view ${schema}:${table}` : fetchError,
  };
};

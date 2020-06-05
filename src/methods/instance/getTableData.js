import queryInstance from '../../api/queryInstance';
import describeTable from '../../api/instance/describeTable';

export default async ({ schema, table, filtered, pageSize, sorted, page, auth, url, signal }) => {
  if (!sorted.length) return false;

  let fetchError = false;
  let newTotalPages = 1;
  let newTotalRecords = 0;
  let newData = [];
  let allAttributes = false;
  let allowedAttributes = false;

  try {
    const { record_count, attributes } = await describeTable({ auth, url, schema, table, signal });
    allAttributes = attributes.map((a) => a.attribute);

    if (filtered.length) {
      const countSQL = `SELECT count(*) as newTotalRecords FROM \`${schema}\`.\`${table}\` WHERE ${filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')}`;
      [{ newTotalRecords }] = await queryInstance({ operation: 'sql', sql: countSQL }, auth, url, signal);
    } else {
      newTotalRecords = record_count;
    }

    newTotalPages = newTotalRecords && Math.ceil(newTotalRecords / pageSize);
  } catch (e) {
    // console.log('Failed to get row count');
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
    allowedAttributes = allAttributes.filter((a) => !newData.attribute_error.includes(a));

    try {
      let dataSQL = `SELECT ${allowedAttributes.map((a) => `\`${a}\``).join(', ')} FROM \`${schema}\`.\`${table}\` `;
      if (filtered.length) dataSQL += `WHERE ${filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')} `;
      if (sorted.length) dataSQL += `ORDER BY \`${sorted[0].id}\` ${sorted[0].desc ? 'DESC' : 'ASC'}`;
      dataSQL += ` OFFSET ${page * pageSize} FETCH ${pageSize}`;

      newData = await queryInstance({ operation: 'sql', sql: dataSQL }, auth, url, signal);
    } catch (e) {
      // console.log('Failed to get table data');
      fetchError = true;
    }
  }

  const result = {
    newData: [],
    newTotalPages,
    newTotalRecords,
    allowedAttributes,
  };

  if (fetchError || !Array.isArray(newData) || newData.error) {
    return result;
  }

  if (newData) result.newData = newData;

  return result;
};

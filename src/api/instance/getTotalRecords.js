import queryInstance from '../queryInstance';

export default async ({ schema, table, auth, url }) => {
  let newTotalRecords = 0;
  try {
    [{ newTotalRecords }] = await queryInstance({ operation: 'sql', sql: `SELECT count(*) as newTotalRecords FROM ${schema}.${table} ` }, auth, url);
  } catch (e) {
    // console.log('Failed to get row count');
  }
  return newTotalRecords;
};

import queryInstance from '../queryInstance';

export default async ({ schema, table, auth }) => {
  let newTotalRecords = 0;
  try {
    [{ newTotalRecords }] = await queryInstance({ operation: 'sql', sql: `SELECT count(*) as newTotalRecords FROM ${schema}.${table} ` }, auth);
  } catch (e) {
    console.log('Failed to get row count');
  }
  return newTotalRecords;
};

import queryInstance from '../queryInstance';

export default async ({ auth, url, schema, table }) => queryInstance({ operation: 'describe_table', schema, table }, auth, url);

import queryInstance from '../queryInstance';

export default async ({ auth, url, sql, signal }) => queryInstance({ operation: 'sql', sql }, auth, url, signal);

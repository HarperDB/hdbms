import queryInstance from '../queryInstance';

export default async ({ auth, url, sql }) => queryInstance({ operation: 'sql', sql }, auth, url);

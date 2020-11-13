import queryInstance from '../queryInstance';

export default async ({ auth, id, url }) => queryInstance({ operation: 'drop_role', id }, auth, url);

import queryInstance from '../queryInstance';

export default async ({ auth, url }) => queryInstance({ operation: 'list_roles' }, auth, url);

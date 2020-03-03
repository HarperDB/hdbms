import queryInstance from '../queryInstance';

export default async ({ auth }) => queryInstance({ operation: 'list_users' }, auth);


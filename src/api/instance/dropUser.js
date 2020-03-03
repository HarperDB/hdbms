import queryInstance from '../queryInstance';

export default async ({ auth, username }) => queryInstance({ operation: 'drop_user', username }, auth);

import queryInstance from '../queryInstance';

export default async ({ auth, username, url }) => queryInstance({ operation: 'drop_user', username }, auth, url);

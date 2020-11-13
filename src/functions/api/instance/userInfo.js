import queryInstance from '../queryInstance';

export default async ({ auth, url }) => queryInstance({ operation: 'user_info' }, auth, url);

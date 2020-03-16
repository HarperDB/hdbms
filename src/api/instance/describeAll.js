import queryInstance from '../queryInstance';

export default async ({ auth, url }) => queryInstance({ operation: 'describe_all' }, auth, url);

import queryInstance from '../queryInstance';

export default async ({ auth, url }) => queryInstance({ operation: 'read_log', limit: 250, order: 'desc' }, auth, url);

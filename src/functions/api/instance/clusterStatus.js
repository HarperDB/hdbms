import queryInstance from '../queryInstance';

export default async ({ auth, url }) => queryInstance({ operation: 'cluster_status' }, auth, url);

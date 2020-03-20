import queryInstance from '../queryInstance';

export default async ({ auth, url, role, permission }) => queryInstance({ operation: 'add_role', role, permission }, auth, url);

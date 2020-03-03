import queryInstance from '../queryInstance';

export default async ({ auth, key, company }) => queryInstance({ operation: 'set_license', key, company }, auth);

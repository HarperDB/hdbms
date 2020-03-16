import queryInstance from '../queryInstance';

export default async ({ auth, url }) => queryInstance({ operation: 'registration_info' }, auth, url);

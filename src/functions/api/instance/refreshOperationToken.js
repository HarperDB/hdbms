import queryInstance from '../queryInstance';

export default async ({ auth, url }) => queryInstance({ operation: { operation: 'refresh_operation_token' }, auth, url, authType: 'token' });

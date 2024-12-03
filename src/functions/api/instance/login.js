import queryInstance from '../queryInstance';

export default async ({ auth, url }) =>
	queryInstance({
		operation: { operation: 'login', username: auth.user, password: auth.pass },
		auth,
		url,
		timeout: 5000,
	});

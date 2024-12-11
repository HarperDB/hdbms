import isEmail from '../util/isEmail';
import addCustomer from '../api/lms/addCustomer';
import config from '../../config';
import isAlphaNumeric from '../util/isAlphaNumeric';
import getUser from '../api/lms/getUser';
import useQueryFabric from '../api/functions/queryFabric';

export default async ({ formData, theme }) => {
	const { firstname, lastname, email, subdomain, password } = formData;

	if (!firstname || !lastname || !email || !subdomain) {
		return {
			error: 'All fields must be filled out',
		};
	}
	if (!isEmail(email)) {
		return {
			error: 'Please provide a valid email',
		};
	}

	if (!isAlphaNumeric(subdomain)) {
		return {
			error: 'subdomain: alphanumeric characters only',
		};
	}
	if (subdomain.length > 14) {
		return {
			error: 'subdomain: max 14 characters',
		};
	}

	if (
		theme === 'akamai' &&
		formData.email.indexOf('harperdb.io') === -1 &&
		formData.email.indexOf('akamai.com') === -1 &&
		formData.email.indexOf('walmart.com') === -1
	) {
		return {
			error: 'portal signup denied',
		};
	}

	try {
		const { response } = await useQueryFabric({
			url: '/User',
			method: 'POST',
			body: {
				email,
				firstname,
				lastname,
				password,
				subdomain,
			},
		});
		return await response.json();
	} catch (error) {
		return error;
	}
};

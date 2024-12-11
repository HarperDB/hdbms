import config from '../../../config';

const queryFabric = async ({ url, method, body }) => {
	try {
		const response = await fetch(`${config.central_manager_api_url}${url}`, {
			method,
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		});
		return await response.json();
	} catch (error) {
		return error;
	}
};

export default queryFabric;

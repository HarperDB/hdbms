import config from '../../../config';

/**
 * Query the fabric API.
 *
 * @param {Object} options - The options for the API request.
 * @param {string} options.url - The URL for the API request.
 * @param {string} options.method - The HTTP method for the API request.
 * @param {Object} options.headers - The headers for the API request.
 * @param {Object} options.body - The body for the API request.
 * @returns {Promise<Object|Error>} - The response from the API request or an error.
 */

const queryFabric = async ({ url, method, headers, body }) => {
	try {
		const response = await fetch(`${config.central_manager_api_url}${url}`, {
			method,
			headers: new Headers(headers),
			body: JSON.stringify(body),
		});
		if (!response.ok) {
			throw new Error(response.statusText);
		}
		return await response.json();
	} catch (error) {
		return error;
	}
};

export default queryFabric;

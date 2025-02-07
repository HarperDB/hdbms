import axios from 'axios';

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_CENTRAL_MANAGER_API_URL,
	timeout: 15000,
	headers: {
		'Content-Type': 'application/json',
	},
});
export default apiClient;

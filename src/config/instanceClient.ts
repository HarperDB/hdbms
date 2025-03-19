import axios from 'axios';

const instanceClient = axios.create({
	withCredentials: true,
	timeout: 15000,
	headers: {
		'Content-Type': 'application/json',
	},
});
export default instanceClient;

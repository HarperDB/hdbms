import apiClient from '@/config/apiClient';
import { useQuery } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation

export const onGetCurrentUser = async () => {
	const { data: response } = await apiClient.get('/User/current');
	if (response) {
		console.log('response:', response);
		return response;
	}
	throw new Error('Something went wrong');
};

export function useOnGetCurrentUser() {
	return useQuery({
		queryKey: ['user'],
		queryFn: onGetCurrentUser,
	});
}

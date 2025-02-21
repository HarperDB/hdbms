import apiClient from '@/config/apiClient';
import { useQuery } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation
type OrgRoles = {
	id: string;
	organizationId: string;
	organizationName: string;
	roleName: 'admin' | 'member';
};
type GetCurrentUserResponse = {
	id: string;
	email: string;
	firstname: string;
	lastname: string;
	roles: OrgRoles[];
};

export const onGetCurrentUser = async () => {
	const { data: response } = await apiClient.get('/User/current');
	if (response) {
		return response as GetCurrentUserResponse;
	}
	throw new Error('Something went wrong');
};

export function useOnGetCurrentUser() {
	return useQuery({
		queryKey: ['user'],
		queryFn: onGetCurrentUser,
	});
}

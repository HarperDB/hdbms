import apiClient from '@/config/apiClient';
import { queryKeys } from '@/react-query/constants';
import { useQuery } from '@tanstack/react-query';

type OrgRoles = {
	id: string;
	organizationId: string;
	organizationName: string;
	roleName: 'admin' | 'member';
};

// TODO: Consolidate with useOnSignUpSubmitMutation
type User = {
	id: string;
	email: string;
	firstname: string;
	lastname: string;
	roles: OrgRoles[];
};

const getCurrentUser = async () => {
	const { data } = await apiClient.get('/User/current');
	return data as User;
};

export function useGetCurrentUser() {
	const { data, isLoading } = useQuery({
		queryKey: [queryKeys.user],
		queryFn: getCurrentUser,
		retry: false,
	});

	return { data, isLoading };
}

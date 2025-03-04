import apiClient from '@/config/apiClient';
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
	roles?: OrgRoles[];
};

const getClusterInfo = async (clusterId: string) => {
	const response = await apiClient.get(`/Cluster/${clusterId}`);
	if (response.status == 200 && response.data) {
		return response.data as User;
	}
	return null;
};

export function useGetClusterInfo(clusterId: string) {
	return useQuery<User | null>({
		queryKey: ['cluster', clusterId],
		queryFn: () => getClusterInfo(clusterId),
		retry: false,
	});
}

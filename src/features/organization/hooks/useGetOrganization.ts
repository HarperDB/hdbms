import apiClient from '@/config/apiClient';
import { queryKeys } from '@/react-query/constants';
import { useQuery } from '@tanstack/react-query';

type Cluster = {
	id: string;
	name: string;
	organizationId: string;
};

// TODO: Consolidate with useOnSignUpSubmitMutation
type Organization = {
	id: string;
	name: string;
	subdomain: string;
	createdByUserId: string;
	clusters?: Cluster[];
};

const getOrganization = async (orgId: string) => {
	const response = await apiClient.get(`/Organization/${orgId}`);
	if (response.status == 200 && response.data) {
		return response.data as Organization;
	}
	return null;
};

export function useGetOrganization(orgId: string) {
	return useQuery({
		queryKey: [queryKeys.organization, orgId],
		queryFn: () => getOrganization(orgId),
		retry: false,
	});
}

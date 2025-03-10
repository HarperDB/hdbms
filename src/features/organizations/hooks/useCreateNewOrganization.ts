import apiClient from '@/config/apiClient';
import { useMutation } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation
export type NewOrganizationInfo = {
	orgName: string;
	orgSubdomain: string;
};

type NewClusterInfoResponse = {
	id: string;
	name: string;
	createdByUserId: string;
	subdomain: string;
};

export const onNewOrganizationSubmit = async ({
	orgName,
	orgSubdomain,
}: NewOrganizationInfo): Promise<NewClusterInfoResponse> => {
	const { data } = await apiClient.post('/Organization', {
		name: orgName,
		subdomain: orgSubdomain,
	});
	if (data) {
		return data as NewClusterInfoResponse;
	} else {
		throw new Error('Something went wrong');
	}
};

export function useCreateNewOrganizationMutation() {
	return useMutation<NewClusterInfoResponse, Error, NewOrganizationInfo>({
		mutationFn: (clusterInfo) => onNewOrganizationSubmit(clusterInfo),
	});
}

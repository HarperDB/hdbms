import apiClient from '@/config/apiClient';
import { useMutation } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation
export type NewClusterInfo = {
	clusterName: string;
	organizationId: string;
	clusterPrefix: string;
};

type NewClusterInfoResponse = {
	id: string;
	name: string;
	organizationId: string;
	prefix: string;
};

export const onNewClusterSubmit = async ({
	clusterName,
	organizationId,
	clusterPrefix,
}: NewClusterInfo): Promise<NewClusterInfoResponse> => {
	const { data } = await apiClient.post('/Cluster', {
		name: clusterName,
		prefix: clusterPrefix,
		organizationId,
	});
	if (data) {
		return data as NewClusterInfoResponse;
	} else {
		throw new Error('Something went wrong');
	}
};

export function useCreateNewClusterMutation() {
	return useMutation<NewClusterInfoResponse, Error, NewClusterInfo>({
		mutationFn: (clusterInfo) => onNewClusterSubmit(clusterInfo),
	});
}

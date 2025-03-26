import apiClient from '@/config/apiClient';
import { useMutation } from '@tanstack/react-query';

export type NewClusterInfo = {
	clusterName: string;
	organizationId: string;
	clusterTag: string;
};

type NewClusterInfoResponse = {
	id: string;
	name: string;
	organizationId: string;
	tag: string;
};

export const onNewClusterSubmit = async ({
	clusterName,
	organizationId,
	clusterTag,
}: NewClusterInfo): Promise<NewClusterInfoResponse> => {
	const { data } = await apiClient.post('/Cluster', {
		name: clusterName,
		tag: clusterTag,
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

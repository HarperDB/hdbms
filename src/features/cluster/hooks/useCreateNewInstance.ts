import apiClient from '@/config/apiClient';
import { useMutation } from '@tanstack/react-query';

// TODO: Consolidate with useOnSignUpSubmitMutation
export type NewInstanceInfo = {
	name: string;
	instanceTypeId: string;
	clusterId: string;
	storage: number;
};

type NewInstanceInfoResponse = {
	id: string;
	status: 'PROVISIONING' | 'RUNNING' | 'STOPPED' | 'TERMINATED';
	instanceTypeId: string;
	hostId: string;
	createdByUserId: string;
	clusterId: string;
	name: string;
	version: string;
	fqdns: string[];
	replicationHosts: string[];
	tempPassword: string;
};

export const onNewInstanceSubmit = async ({
	name,
	instanceTypeId,
	clusterId,
	storage,
}: NewInstanceInfo): Promise<NewInstanceInfoResponse> => {
	const { data } = await apiClient.post('/HDBInstance', {
		name,
		instanceTypeId,
		clusterId,
		storage,
		hostId: 'hos-ukg97o94gswdkx4j',
		gtmFqdn: 'gtmFqdn',
	});
	if (data) {
		return data as NewInstanceInfoResponse;
	} else {
		throw new Error('Something went wrong');
	}
};

export function useCreateNewInstanceMutation() {
	return useMutation<NewInstanceInfoResponse, Error, NewInstanceInfo>({
		mutationFn: (clusterInfo) => onNewInstanceSubmit(clusterInfo),
	});
}

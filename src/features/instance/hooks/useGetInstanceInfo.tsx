import apiClient from '@/config/apiClient';
import { queryKeys } from '@/react-query/constants';
import { useQuery } from '@tanstack/react-query';

type Cluster = {
	id: string;
	name: string;
	organizationId: string;
};

export type InstanceType = {
	id: string;
	selfHosted: boolean;
	useSharedProcess: boolean;
	threads: number;
	cpu: number;
	memory: number;
	readIops: number;
	writeIops: number;
};

export type Instance = {
	id: string;
	status: 'PROVISIONING' | 'RUNNING' | 'STOPPED' | 'TERMINATED';
	instanceTypeId: string;
	hostId: string;
	createdByUserId: string;
	fqdns: string[];
	replicationHosts: string[];
	clusterId: string;
	name: string;
	version: string;
	tempPassword: string;
	cluster: Cluster;
	instanceType: InstanceType;
};

const getInstanceInfo = async (instanceId: string) => {
	const { data } = await apiClient.get(`/HDBInstance/${instanceId}`);
	return data as Instance;
};

export function useGetInstanceInfo(instanceId: string) {
	const { data, isLoading } = useQuery({
		queryKey: [queryKeys.instance, instanceId],
		queryFn: () => getInstanceInfo(instanceId),
		retry: false,
	});

	return { data, isLoading };
}

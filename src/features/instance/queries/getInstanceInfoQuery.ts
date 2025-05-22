import apiClient from '@/config/apiClient';
import { queryKeys } from '@/react-query/constants';
import { queryOptions } from '@tanstack/react-query';

type Cluster = {
	id: string;
	name: string;
	organizationId: string;
};

type InstanceType = {
	id: string;
	selfHosted: boolean;
	useSharedProcess: boolean;
	threads: number;
	cpu: number;
	memory: number;
	readIops: number;
	writeIops: number;
};

type Instance = {
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

function getInstanceInfoQueryOptions(instanceId: string) {
	return queryOptions({
		queryKey: [queryKeys.instance, instanceId],
		queryFn: () => getInstanceInfo(instanceId),
		retry: false,
	});
}

export type { Instance, InstanceType, Cluster };
export { getInstanceInfoQueryOptions };

import apiClient from '@/config/apiClient';
import { queryKeys } from '@/react-query/constants';
import { useQuery } from '@tanstack/react-query';

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
};

export type Cluster = {
	id: string;
	organizationId: string;
	name: string;
	instances: Instance[];
};

const getClusterInfo = async (clusterId: string) => {
	const { data } = await apiClient.get(`/Cluster/${clusterId}`);
	return data as Cluster;
};

export function useGetClusterInfo(clusterId: string) {
	const { data, isLoading } = useQuery({
		queryKey: [queryKeys.cluster, clusterId],
		queryFn: () => getClusterInfo(clusterId),
		retry: false,
	});

	return { data, isLoading };
}

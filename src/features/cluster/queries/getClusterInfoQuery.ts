import { BadgeStatus } from '@/components/ui/utils/badgeStatus';
import apiClient from '@/config/apiClient';
import { queryKeys } from '@/react-query/constants';
import { queryOptions } from '@tanstack/react-query';

type Instance = {
	id: string;
	status: BadgeStatus;
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

type Cluster = {
	id: string;
	organizationId: string;
	name: string;
	instances: Instance[];
};

const getClusterInfo = async (clusterId: string) => {
	const { data } = await apiClient.get(`/Cluster/${clusterId}`);
	return data as Cluster;
};

function getClusterInfoQueryOptions(clusterId: string) {
	return queryOptions({
		queryKey: [queryKeys.cluster, clusterId],
		queryFn: () => getClusterInfo(clusterId),
		retry: false,
	});
}

export type { Cluster };
export { getClusterInfoQueryOptions };

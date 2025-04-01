import apiClient from '@/config/apiClient';
import { queryKeys } from '@/react-query/constants';

type RegionLocation = {
	id: string;
	region: string;
	cloudProvider: 'linode' | 'aws' | 'gcp' | 'azure' | 'self-hosted' | 'none';
	location: string;
};

type RegionLocations = RegionLocation[];

const getRegionLocations = async () => {
	const { data } = await apiClient.get(`/Location`);
	return data as RegionLocations;
};

function getRegionLocationsOptions() {
	return {
		queryKey: [queryKeys.cluster, 'regionLocations'],
		queryFn: getRegionLocations,
		retry: false,
	};
}

export { getRegionLocationsOptions };

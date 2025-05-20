import { useContext } from 'react';
import { ClusterAuthContext, ClusterContextValue } from '@/features/cluster/context/ClusterAuthContext';

const useCluster = () => {
	return useContext(ClusterAuthContext) as ClusterContextValue;
};

export default useCluster;

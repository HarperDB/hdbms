import { Instance, Cluster, getClusterInfoQueryOptions } from '@/features/cluster/queries/getClusterInfoQuery';
import {
	InstanceLoginCredentials,
	useCreateInstanceLoginMutation,
} from '@/features/instance/operations/mutations/readInstanceLogin';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createContext, useState, PropsWithChildren, useCallback, useEffect } from 'react';

type ClusterContextValue = {
	isAuth: boolean;
	instances: Instance[];
	clusterId: string | null;
	isLoading: boolean;
	loadCluster: (clusterId: string) => void;
	checkAuth: () => void;
	login: (credentials: InstanceLoginCredentials) => Promise<{ success: boolean; message: string }>;
	logout: () => Promise<boolean>;
};

const ClusterAuthContext = createContext<ClusterContextValue | null>(null);

type ClusterWithAuth = Cluster & { isAuthenticated: boolean };

const ClusterProvider = ({ children }: PropsWithChildren<ClusterContextValue>) => {
	const [isAuth, setIsAuth] = useState(false);
	const [clusterId, setClusterId] = useState<string | null>(null);
	const [clusterData, setClusterData] = useState<Map<string, ClusterWithAuth>>(new Map());
	const { data: clusterInfoQueryData, isLoading } = useSuspenseQuery(
		getClusterInfoQueryOptions(clusterId ?? '', clusterId != null)
	);

	useEffect(() => {
		if (clusterInfoQueryData && !isLoading) {
			const newData = new Map(clusterData);
			newData.set(clusterInfoQueryData.id, {
				...clusterInfoQueryData,
				isAuthenticated: newData.get(clusterInfoQueryData.id)?.isAuthenticated ?? false,
			});

			setClusterData(newData);
		}
	}, [clusterInfoQueryData, isLoading, clusterData]);

	const { mutateAsync: submitInstanceLoginInfo } = useCreateInstanceLoginMutation();

	const login = useCallback(
		async (credentials: InstanceLoginCredentials) => {
			try {
				const response = await submitInstanceLoginInfo(credentials);

				return { success: true, message: response.message };
			} catch (e) {
				return { success: false, message: e instanceof Error ? e?.message : 'An Error Occurred.' };
			}
		},
		[submitInstanceLoginInfo]
	);

	const logout = useCallback(async () => {
		// login code here
		return false;
	}, []);

	const checkAuth = useCallback(async () => {
		// check auth code here
		return false;
	}, []);

	const setCluster = (clusterId: string) => setClusterId(clusterId);

	const contextValue = {
		isAuth,
		isLoading,
		loadCluster: setCluster,
		instances: clusterData.get(clusterId ?? '')?.instances ?? ([] as Instance[]),
		checkAuth,
		login,
		logout,
		clusterId: null,
	} satisfies ClusterContextValue;

	// All your auth related code goes here
	return <ClusterAuthContext.Provider value={contextValue}>{children}</ClusterAuthContext.Provider>;
};

export { ClusterAuthContext, ClusterProvider };
export type { ClusterContextValue };

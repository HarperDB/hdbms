import { createHashRouter } from 'react-router';
import LocalSignIn from '@/features/auth/LocalSignIn';
import ProtectedRoutes from '@/features/layouts/ProtectedRoutes';
import Instance from '@/features/instance';
import ClusterList from '@/features/organization';

const localRouter = createHashRouter([
	{
		path: '/sign-in',
		Component: LocalSignIn,
	},
	{
		path: '/',
		Component: ProtectedRoutes,
		children: [
			{
				index: true,
				Component: Instance,
			},
			{
				path: 'clusters',
				Component: ClusterList, // When clicking a cluster, it should be a direct link to the other localhost studio. ex. https://192.168.1:9925
			},
			{
				path: 'clusters/:clusterId/instances',
				Component: Instance,
			},
		],
	},
]);

export default localRouter;

import { createRootRoute, createRoute } from '@tanstack/react-router';
import StudioLocal from '../StudioLocal';
import LocalSignIn from '../features/auth/LocalSignIn';
import Dashboard from '../features/layouts/Dashboard';
import Instance from '../features/instance';
// import LocalSignIn from '@/features/auth/LocalSignIn';
// import ProtectedRoutes from '@/features/layouts/ProtectedRoutes';
// import Instance from '@/features/instance';
// import ClusterList from '@/features/organization';


const rootRoute = createRootRoute({
  component: StudioLocal,
});

// Auth Route
const signInRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/',
	component: LocalSignIn,
});


// Dashboard Routes
const dashboardLayout = createRoute({
	getParentRoute: () => rootRoute,
	id: "_dashboardLayout",
	component: Dashboard,
});

const localInstanceRoute = createRoute({
	getParentRoute: () => dashboardLayout,
	path: 'instance',
	component: Instance,
});


export const localRouteTree = rootRoute.addChildren([
	signInRoute,
	dashboardLayout.addChildren([
		localInstanceRoute,
	]),
])


// const localRouter = createHashRouter([
// 	{
// 		path: '/sign-in',
// 		Component: LocalSignIn,
// 	},
// 	{
// 		path: '/',
// 		Component: ProtectedRoutes,
// 		children: [
// 			{
// 				index: true,
// 				Component: Instance,
// 			},
// 			{
// 				path: 'clusters',
// 				Component: ClusterList, // When clicking a cluster, it should be a direct link to the other localhost studio. ex. https://192.168.1:9925
// 			},
// 			{
// 				path: 'clusters/:clusterId/instances',
// 				Component: Instance,
// 			},
// 		],
// 	},
// ]);

// export default localRouter;

import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';
import organizationsRoutes from './features/organizations/routes';
import profileRoutes from './features/profile/routes';
import organizationRoutes from './features/organization/routes';
import clusterRoutes from './features/cluster/routes';
import instanceRoutes from './features/instance/routes';

// TODO: Setup route module type safety ref:https://reactrouter.com/how-to/route-module-type-safety

const HDBLocalInstanceRoutes = [
	index('./features/auth/LocalSignIn.tsx'),
	...prefix('local', [
		// TODO: eliminate /app base route and move all routes to root level
		layout('./features/layouts/DashLayout.tsx', [
			// Profile routes ('/app/profile')
			...profileRoutes,

			// Org specific routes (Clusters List, Billing, Roles, Members, etc...)
			// (e.g. /app/orgs/:orgId)
			...organizationRoutes,

			// Cluster routes (Instance List, Create Instance)
			// (e.g. /app/orgs/:orgId/clusters/:clusterId)
			...clusterRoutes,

			// Instance routes
			// (e.g. /app/orgs/:orgId/clusters/:clusterId/instances/:instanceId/*)
			...instanceRoutes,

			/* TODO: Redirect any unknown route to nearest valid route. */
		]),
	]),
	route('*?', 'catchall.tsx'),
];

const HDBCloudRoutes = [
	// Public routes
	layout('./features/layouts/AuthLayout.tsx', [
		index('./features/auth/SignIn.tsx'),
		route('sign-up', './features/auth/SignUp.tsx'),
		route('reset-password', './features/auth/ResetPassword.tsx'),
	]),

	// Protected routes
	...prefix('app', [
		// TODO: eliminate /app base route and move all routes to root level
		layout('./features/layouts/DashLayout.tsx', [
			// Orgs routes *app base route*
			...organizationsRoutes,

			// Profile routes ('/app/profile')
			...profileRoutes,

			// Org specific routes (Clusters List, Billing, Roles, Members, etc...)
			// (e.g. /app/orgs/:orgId)
			...organizationRoutes,

			// Cluster routes (Instance List, Create Instance)
			// (e.g. /app/orgs/:orgId/clusters/:clusterId)
			...clusterRoutes,

			// Instance routes
			// (e.g. /app/orgs/:orgId/clusters/:clusterId/instances/:instanceId/*)
			...instanceRoutes,

			/* TODO: Redirect any unknown route to nearest valid route.
				Examples:

					Invalid route: /app/orgs/123/unknown-route
					Redirect to: /app/orgs/123

					Invalid route: /app/orgs/123/clusters
					Redirect to: /app/orgs/123

					Invalid route: /app/orgs/123/clusters/unknown-route
					Redirect to: /app/orgs/123

					Invalid route: /app/orgs/123/clusters/456/unknown-route
					Redirect to: /app/orgs/123/clusters/456

					Invalid route: /app/orgs/123/unknown-route/456
					Redirect to: /app/orgs/123

					Invalid route: /app/orgs/123/clusters/456/unknown-route/789
					Redirect to: /app/orgs/123/clusters/456

					etc....
			*/
		]),
	]),
	route('*?', 'catchall.tsx'),
] satisfies RouteConfig;

console.log('No bueno:', import.meta.env.VITE_REACT_APP_LOCALSTUDIO);

const loadedRoutes = import.meta.env.VITE_REACT_APP_LOCALSTUDIO == 'true' ? HDBLocalInstanceRoutes : HDBCloudRoutes;

export default loadedRoutes;

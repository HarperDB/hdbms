import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';
import organizationsRoutes from './components/organizations/routes';
import profileRoutes from './components/profile/routes';
import organizationRoutes from './components/organization/routes';
import clusterRoutes from './components/cluster/routes';
import instanceRoutes from './components/instance/routes';

// TODO: Setup route module type safety ref:https://reactrouter.com/how-to/route-module-type-safety
export default [
	// Public routes
	layout('./components/layouts/AuthLayout.tsx', [
		index('./components/auth/SignIn.tsx'),
		route('sign-up', './components/auth/SignUp.tsx'),
		route('reset-password', './components/auth/ResetPassword.tsx'),
	]),

	// Protected routes
	...prefix('app', [
		// TODO: eliminate /app base route and move all routes to root level
		layout('./components/layouts/DashLayout.tsx', [
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

	route('/', './App.tsx'),
	route('*?', 'catchall.tsx'),
] satisfies RouteConfig;

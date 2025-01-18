import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

// TODO: Setup route module type safety ref:https://reactrouter.com/how-to/route-module-type-safety
// TODO: Figure out how to migrate routes to the feature specific folders.
export default [
	// Public routes
	layout('./components/layouts/AuthLayout.tsx', [
		index('./components/auth/SignIn.tsx'),
		route('sign-up', './components/auth/SignUp.tsx'),
		route('reset-password', './components/auth/ResetPassword.tsx'),
	]),

	// Protected routes
	...prefix('app', [
		layout('./components/layouts/DashLayout.tsx', [
			// Orgs routes *app base route*
			index('./components/organizations/index.tsx'),
			route('new-org', './components/organizations/NewOrg.tsx'), // Modal

			// Profile routes
			...prefix('profile', [
				index('./components/profile/index.tsx'),
				route('update', './components/profile/UpdateProfile.tsx'), // Modal
			]),

			// Org specific routes (Clusters List, Billing, etc...)
			...prefix('org/:orgId', [
				index('./components/organization/index.tsx'),
				route('billing', './components/organization/Billing.tsx'),
				route('create-cluster', './components/clusters/NewCluster.tsx'), // Modal
				route('edit-cluster', './components/clusters/EditCluster.tsx'), // Modal
			]),

			// Instance routes inside a Cluster
			...prefix('org/:orgId/clusters/:clusterId', [
				// Cluster Instance routes (only "1" instance because we'll replicate actions across all instances)
				index('./components/instance/index.tsx'),
				route('new-instance', './components/instance/NewInstance.tsx') /* Maybe???? 
					Should we have a way for users to add more instances here or migrate this functionality to the 
					clusters page. They would then edit an existing cluster and add/remove instance(s)?
				*/,
			]),

			// Cluster Instance Info routes
			...prefix('org/:orgId/clusters/:clusterId/info', [
				index('./components/instance/info/index.tsx'),
				route('logs', './components/instance/info/Logs.tsx'),
			]),

			// Cluster Users routes
			...prefix('org/:orgId/clusters/:clusterId/users', [
				index('./components/clusters/users/index.tsx'),
				route('add', './components/clusters/users/AddUser.tsx'), // Modal
				route('/:id', './components/clusters/users/EditUser.tsx'), // Modal or Sub-view (similar to what's currently in studio)?
				route('roles', './components/clusters/users/Roles.tsx'), // Page
			]),

			...prefix('org/:orgId/clusters/:clusterId/applications', [
				// New (Create/Import a new application)
				/* Editor
						Dynamically append file path to url
				*/
			]),

			...prefix('org/:orgId/clusters/:clusterId/browse', [
				// Add Table
				// Add Database
				/* Database /:databaseId
				 		View Table /:tableId
				 			Add Record
				 			Edit Record /edit/:recordId
				*/
			]),

			/* TODO: Figure out how to redirect any unknown route to the last successful route.
				Examples:

					Invalid route: /app/org/123/unknown-route
					Redirect to: /app/org/123

					Invalid route: /app/org/123/clusters
					Redirect to: /app/org/123

					Invalid route: /app/org/123/clusters/unknown-route
					Redirect to: /app/org/123

					Invalid route: /app/org/123/clusters/456/unknown-route
					Redirect to: /app/org/123/clusters/456

					Invalid route: /app/org/123/unknown-route/456
					Redirect to: /app/org/123

					Invalid route: /app/org/123/clusters/456/unknown-route/789
					Redirect to: /app/org/123/clusters/456

					etc....
			*/
		]),
	]),

	route('/', './App.tsx'),
	route('*?', 'catchall.tsx'),
] satisfies RouteConfig;

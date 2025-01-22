import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

// TODO: Setup route module type safety ref:https://reactrouter.com/how-to/route-module-type-safety
// TODO: Migrate routes to the feature specific folders.
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
				index('./components/organization/index.tsx'), // Will inherit ClusterList from clusters/ClusterList.tsx
				route('billing', './components/organization/Billing.tsx'),
				route('create-cluster', './components/clusters/NewCluster.tsx'), // Modal
				route('edit-cluster', './components/clusters/EditCluster.tsx'), // Modal
			]),

			// Cluster routes (Instance List, Create Instance)
			...prefix('org/:orgId/clusters/:clusterId', [
				index('./components/cluster/index.tsx'), // Will inherit InstanceList from instances/InstanceList.tsx
				route('create-instance', './components/cluster/NewInstance.tsx') /* Maybe????
					Should we have a way for users to add more instances here or migrate this functionality to the 
					clusters page. They would then edit an existing cluster and add/remove instance(s)?
				*/,
			]),

			// Cluster Users routes
			...prefix('org/:orgId/clusters/:clusterId/users', [
				index('./components/cluster/users/index.tsx'),
				route('add', './components/cluster/users/AddUser.tsx'), // Modal
				route('edit/:id', './components/cluster/users/EditUser.tsx'), // Modal or Sub-view (similar to what's currently in studio)?
			]),

			// Cluster Roles routes
			...prefix('org/:orgId/clusters/:clusterId/roles', [
				index('./components/cluster/roles/index.tsx'),
				route('add', './components/cluster/roles/AddRole.tsx'), // Modal
				route('edit/:id', './components/cluster/roles/EditRole.tsx'), // Modal
			]),

			// Instance routes
			...prefix('org/:orgId/clusters/:clusterId/instances/:instanceId/browse', [
				// default route/view when navigating to an instance
				index('./components/instance/browse/index.tsx'), // Show first database and first table in the list by default
				route('add-database', './components/instance/browse/AddDatabase.tsx'), // Modal
				route('/:databaseId/add-table', './components/instance/browse/AddTable.tsx'), // Modal
				route('/:databaseId/:tableId', './components/instance/browse/BrowseDataTable.tsx'), // Child-view inside index.tsx
				route('/:databaseId/:tableId/add-record', './components/instance/browse/AddRecord.tsx'), // Modal
				route('/:databaseId/:tableId/edit/:recordId', './components/instance/browse/EditRecord.tsx'), // Child-view
			]),

			...prefix('org/:orgId/clusters/:clusterId/instances/:instanceId/applications', [
				index('./components/instance/browse/applications/index.tsx'), // Show List of applications/components
				route('new', './components/instance/browse/applications/NewApplication.tsx'), // Modal
				route('edit/:appId', './components/instance/browse/applications/EditApplication.tsx'), // Append folder/file path to url (deep linking)
			]),

			// Instance Info routes
			...prefix('org/:orgId/clusters/:clusterId/instances/:instanceId/info', [
				index('./components/instance/info/index.tsx'),
				route('logs', './components/instance/info/Logs.tsx'),
			]),

			/* TODO: Redirect any unknown route to nearest valid route.
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

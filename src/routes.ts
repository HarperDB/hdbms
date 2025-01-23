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
		// TODO: eliminate /app base route and move all routes to root level
		layout('./components/layouts/DashLayout.tsx', [
			// Orgs routes *app base route*
			index('./components/organizations/index.tsx'), // redirects to /app/orgs as base route
			route('new', './components/organizations/NewOrg.tsx'), // Modal

			// Profile routes
			...prefix('profile', [
				index('./components/profile/index.tsx'),
				route('update', './components/profile/UpdateProfile.tsx'), // Modal
			]),

			// Org specific routes (Clusters List, Billing, etc...)
			...prefix('orgs/:orgId', [
				index('./components/organization/index.tsx'), // Will inherit ClusterList from clusters/ClusterList.tsx
				route('billing', './components/organization/Billing.tsx'),
				route('create-cluster', './components/clusters/NewCluster.tsx'), // Modal
				route('edit-cluster', './components/clusters/EditCluster.tsx'), // Modal
			]),

			// Org Roles routes
			...prefix('orgs/:orgId/roles', [
				index('./components/organization/roles/index.tsx'),
				route('add', './components/organization/roles/AddRole.tsx'), // Modal
				route('edit/:roleId', './components/organization/roles/EditRole.tsx'), // Modal
			]),

			// Org Members routes
			...prefix('orgs/:orgId/members', [
				index('./components/organization/members/index.tsx'),
				route('add', './components/organization/members/AddMember.tsx'), // Modal
				route('edit/:userId', './components/organization/members/EditMember.tsx'), // Modal or Sub-view (similar to what's currently in studio)?
			]),

			// Cluster routes (Instance List, Create Instance)
			...prefix('orgs/:orgId/clusters/:clusterId', [
				index('./components/cluster/index.tsx'), // Will inherit InstanceList from instances/InstanceList.tsx
				route('create-instance', './components/cluster/NewInstance.tsx'), // Modal
			]),

			// Instance routes
			...prefix('orgs/:orgId/clusters/:clusterId/instances/:instanceId/browse', [
				// default route/view when navigating to an instance
				index('./components/instance/browse/index.tsx'), // Show first database and first table in the list by default
				route('add-database', './components/instance/browse/AddDatabase.tsx'), // Modal
				route('/:databaseId/add-table', './components/instance/browse/AddTable.tsx'), // Modal
				route('/:databaseId/:tableId', './components/instance/browse/BrowseDataTable.tsx'), // Child-view inside index.tsx
				route('/:databaseId/:tableId/add-record', './components/instance/browse/AddRecord.tsx'), // Modal
				route('/:databaseId/:tableId/edit/:recordId', './components/instance/browse/EditRecord.tsx'), // Child-view
			]),

			...prefix('orgs/:orgId/clusters/:clusterId/instances/:instanceId/applications', [
				index('./components/instance/browse/applications/index.tsx'), // Show List of applications/components
				route('new', './components/instance/browse/applications/NewApplication.tsx'), // Modal
				route('edit/:appId', './components/instance/browse/applications/EditApplication.tsx'), // Append folder/file path to url (deep linking)
			]),

			// Instance Info routes
			...prefix('orgs/:orgId/clusters/:clusterId/instances/:instanceId/info', [
				index('./components/instance/info/index.tsx'),
				route('logs', './components/instance/info/Logs.tsx'),
			]),

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

import { type RouteConfig, index, prefix, route } from '@react-router/dev/routes';

const instanceBrowseRoutes: RouteConfig = [
	...prefix('orgs/:orgId/clusters/:clusterId/instances/:instanceId/browse', [
		// default route/view when navigating to an instance
		index('./features/instance/browse/index.tsx'), // Show first database and first table in the list by default
		route('add-database', './features/instance/browse/AddDatabase.tsx'), // Modal
		route('/:databaseId/add-table', './features/instance/browse/AddTable.tsx'), // Modal
		route('/:databaseId/:tableId', './features/instance/browse/BrowseDataTable.tsx'), // Child-view inside index.tsx
		route('/:databaseId/:tableId/add-record', './features/instance/browse/AddRecord.tsx'), // Modal
		route('/:databaseId/:tableId/edit/:recordId', './features/instance/browse/EditRecord.tsx'), // Child-view
	]),
];

const instanceApplicationsRoutes: RouteConfig = [
	...prefix('orgs/:orgId/clusters/:clusterId/instances/:instanceId/applications', [
		index('./features/instance/browse/applications/index.tsx'), // Show List of applications/components
		route('new', './features/instance/browse/applications/NewApplication.tsx'), // Modal
		route('edit/:appId', './features/instance/browse/applications/EditApplication.tsx'), // Append folder/file path to url (deep linking)
	]),
];

const instanceInfoRoutes: RouteConfig = [
	...prefix('orgs/:orgId/clusters/:clusterId/instances/:instanceId/info', [
		index('./features/instance/info/index.tsx'),
		route('logs', './features/instance/info/Logs.tsx'),
	]),
];

export default [...instanceBrowseRoutes, ...instanceApplicationsRoutes, ...instanceInfoRoutes];

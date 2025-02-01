import { type RouteConfig, index, prefix, route } from '@react-router/dev/routes';

const organizationRoutes: RouteConfig = [
	...prefix('orgs/:orgId', [
		index('./features/organization/index.tsx'), // Will inherit ClusterList from clusters/ClusterList.tsx
		route('billing', './features/organization/Billing.tsx'),
		route('create-cluster', './features/clusters/NewCluster.tsx'), // Modal
		route('edit-cluster', './features/clusters/EditCluster.tsx'), // Modal
	]),
];

const organizationRolesRoutes: RouteConfig = [
	...prefix('orgs/:orgId/roles', [
		index('./features/organization/roles/index.tsx'),
		route('add', './features/organization/roles/AddRole.tsx'), // Modal
		route('edit/:roleId', './features/organization/roles/EditRole.tsx'), // Modal
	]),
];

const organizationMemberRoutes: RouteConfig = [
	...prefix('orgs/:orgId/members', [
		index('./features/organization/members/index.tsx'),
		route('add', './features/organization/members/AddMember.tsx'), // Modal
		route('edit/:userId', './features/organization/members/EditMember.tsx'), // Modal or Sub-view (similar to what's currently in studio)?
	]),
];
export default [...organizationRoutes, ...organizationRolesRoutes, ...organizationMemberRoutes];

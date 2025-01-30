import { type RouteConfig, index, prefix, route } from '@react-router/dev/routes';

const organizationRoutes: RouteConfig = [
	...prefix('orgs/:orgId', [
		index('./components/organization/index.tsx'), // Will inherit ClusterList from clusters/ClusterList.tsx
		route('billing', './components/organization/Billing.tsx'),
		route('create-cluster', './components/clusters/NewCluster.tsx'), // Modal
		route('edit-cluster', './components/clusters/EditCluster.tsx'), // Modal
	]),
];

const organizationRolesRoutes: RouteConfig = [
	...prefix('orgs/:orgId/roles', [
		index('./components/organization/roles/index.tsx'),
		route('add', './components/organization/roles/AddRole.tsx'), // Modal
		route('edit/:roleId', './components/organization/roles/EditRole.tsx'), // Modal
	]),
];

const organizationMemberRoutes: RouteConfig = [
	...prefix('orgs/:orgId/members', [
		index('./components/organization/members/index.tsx'),
		route('add', './components/organization/members/AddMember.tsx'), // Modal
		route('edit/:userId', './components/organization/members/EditMember.tsx'), // Modal or Sub-view (similar to what's currently in studio)?
	]),
];
export default [...organizationRoutes, ...organizationRolesRoutes, ...organizationMemberRoutes];

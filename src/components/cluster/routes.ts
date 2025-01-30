import { type RouteConfig, index, prefix, route } from '@react-router/dev/routes';

const clusterRoutes: RouteConfig = [
	...prefix('orgs/:orgId/clusters/:clusterId', [
		index('./components/cluster/index.tsx'), // Will inherit InstanceList from instances/InstanceList.tsx
		route('create-instance', './components/cluster/CreateInstance.tsx'), // Modal
	]),
];

export default [...clusterRoutes];

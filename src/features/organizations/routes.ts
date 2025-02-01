import { type RouteConfig, index, route } from '@react-router/dev/routes';

const organizationsRoutes: RouteConfig = [
	index('./features/organizations/index.tsx'), // redirects to /app/orgs as base route
	route('new', './features/organizations/NewOrg.tsx'), // Modal
];

export default [...organizationsRoutes];

import { type RouteConfig, index, prefix, route } from '@react-router/dev/routes';

const profileRoutes: RouteConfig = [
	...prefix('profile', [
		index('./components/profile/index.tsx'),
		route('update', './components/profile/UpdateProfile.tsx'), // Modal
	]),
];

export default [...profileRoutes];

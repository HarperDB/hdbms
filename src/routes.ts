import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

export default [
	layout('./components/layouts/AuthLayout.tsx', [
		index('./components/auth/SignIn.tsx'),
		route('sign-up', './components/auth/SignUp.tsx'),
		route('reset-password', './components/auth/ResetPassword.tsx'),
	]),

	route('app', './components/layouts/DashLayout.tsx', [
		index('./components/organizations/index.tsx'),
		// Organizations routes
		...prefix('org/:id', [
			// if route is not found, redirect to orgs base route
			index('./components/organization/index.tsx'),
			route('new-org', './components/organizations/NewOrg.tsx'),
		]),

		...prefix('org/:id/clusters/:id', []),
	]),

	// ...prefix('app', [
	// 	layout('./components/layouts/DashLayout.tsx', [
	// 		index('./components/organizations/index.tsx'),
	// 		// Organizations routes
	// 		...prefix('orgs', [
	// 			route('./components/organizations/index.tsx'),
	// 			route('/new', './components/organizations/NewOrg.tsx'),
	// 		]),
	// 	]),
	// ]),
	route('/', './App.tsx'),
	route('*?', 'catchall.tsx'),
] satisfies RouteConfig;

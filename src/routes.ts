import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

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
			// Orgs routes *base route*
			index('./components/organizations/index.tsx'),
			route('new-org', './components/organizations/NewOrg.tsx'),

			...prefix('profile', [
				index('./components/profile/index.tsx'),
				route('update', './components/profile/UpdateProfile.tsx'),
			]),

			// Org routes
			...prefix('org/:id', [
				index('./components/organization/index.tsx'),
				route('billing', './components/organization/Billing.tsx'),
			]),

			// Cluster routes
			...prefix('org/:id/clusters/:id', [
				index('./components/clusters/index.tsx'),
				route('new-cluster', './components/clusters/NewCluster.tsx'),

				// Cluster Users routes
				...prefix('users', [
					index('./components/clusters/users/index.tsx'),
					route('new-user', './components/clusters/users/NewUser.tsx'), // Modal
					route('add', './components/clusters/users/AddUser.tsx'), // Modal
					route('/:id', './components/clusters/users/EditUser.tsx'),
					route('roles', './components/clusters/users/Roles.tsx'),
				]),
			]),

			// Cluster Instance routes
			...prefix('org/:id/clusters/:id/instance/', [
				index('./components/instance/index.tsx'),
				route('new-instance', './components/instance/NewInstance.tsx'),
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

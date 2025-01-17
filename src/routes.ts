import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
	layout('./components/layouts/AuthLayout.tsx', [
		index('./components/auth/SignIn.tsx'),
		route('/sign-up', './components/auth/SignUp.tsx'),
		route('/reset-password', './components/auth/ResetPassword.tsx'),
	]),
	route('/', './App.tsx'),
	route('*?', 'catchall.tsx'),
] satisfies RouteConfig;

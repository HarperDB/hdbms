import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
const AuthLayout = lazy(() => import('@/features/layouts/AuthLayout'));
const SignIn = lazy(() => import('@/features/auth/SignIn'));
const SignUp = lazy(() => import('@/features/auth/SignUp'));
const ResetPassword = lazy(() => import('@/features/auth/ResetPassword'));
const Organizations = lazy(() => import('@/features/organizations'));
const ProtectedRoutes = lazy(() => import('@/features/layouts/ProtectedRoutes'));

const cloudRouter = createBrowserRouter([
	{
		path: '/',
		Component: AuthLayout,
		children: [
			{
				path: 'sign-in',
				Component: SignIn,
			},
			{
				path: 'sign-up',
				Component: SignUp,
			},
			{
				path: 'reset-password',
				Component: ResetPassword,
			},
		],
	},
	{
		path: '/',
		Component: ProtectedRoutes,
		children: [
			{
				index: true,
				Component: Organizations,
			},
		],
	},
]);

export default cloudRouter;

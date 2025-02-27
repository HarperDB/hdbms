import { lazy } from 'react';
import { createHashRouter } from 'react-router';
const AuthLayout = lazy(() => import('@/features/layouts/AuthLayout'));
const SignIn = lazy(() => import('@/features/auth/SignIn'));
const SignUp = lazy(() => import('@/features/auth/SignUp'));
const ResetPassword = lazy(() => import('@/features/auth/ResetPassword'));
const Organizations = lazy(() => import('@/features/organizations'));
const DashLayout = lazy(() => import('@/features/layouts/DashLayout'));
const Profile = lazy(() => import('@/features/profile'));

const cloudRouter = createHashRouter([
	{
		path: 'signin',
		Component: AuthLayout,
		children: [
			{
				index: true,
				Component: SignIn,
			},
		],
	},
	{
		path: 'signup',
		Component: AuthLayout,
		children: [
			{
				index: true,
				Component: SignUp,
			},
		],
	},
	{
		path: 'resetpassword',
		Component: AuthLayout,
		children: [
			{
				index: true,
				Component: ResetPassword,
			},
		],
	},
	{
		Component: DashLayout,
		children: [
			{
				path: 'organizations',
				Component: Organizations,
			},
			{
				path: '/',
				Component: Organizations,
			},
			{
				path: '/profile',
				Component: Profile,
			},
		],
	},
]);

export default cloudRouter;

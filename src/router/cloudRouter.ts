import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
const AuthLayout = lazy(() => import('@/features/layouts/AuthLayout'));
const SignIn = lazy(() => import('@/features/auth/SignIn'));
const SignUp = lazy(() => import('@/features/auth/SignUp'));
const ResetPassword = lazy(() => import('@/features/auth/ResetPassword'));
const Organizations = lazy(() => import('@/features/organizations'));
const ProtectedRoutes = lazy(() => import('@/features/layouts/ProtectedRoutes'));
const Profile = lazy(() => import('@/features/profile'));

const cloudRouter = createBrowserRouter([
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
		Component: ProtectedRoutes,
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

// const cloudRouter = createBrowserRouter([
// 	{
// 		path: '/sign-in',
// 		Component: AuthLayout,
// 		children: [
// 			{
// 				index: true,
// 				Component: SignIn,
// 			},
// 		],
// 	},
// 	{
// 		path: '/reset-password',
// 		Component: AuthLayout,
// 		children: [
// 			{
// 				index: true,
// 				Component: ResetPassword,
// 			},
// 		],
// 	},
// 	{
// 		path: '/sign-up',
// 		Component: AuthLayout,
// 		children: [
// 			{
// 				index: true,
// 				Component: SignUp,
// 			},
// 		],
// 	},
// 	{
// 		path: '/',
// 		Component: ProtectedRoutes,
// 		children: [
// 			{
// 				index: true,
// 				Component: Organizations,
// 			},
// 		],
// 	},
// ]);

export default cloudRouter;

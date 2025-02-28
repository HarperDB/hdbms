import { createRootRoute, createRoute } from '@tanstack/react-router';
import StudioCloud from '../StudioCloud';
import Dashboard from '../features/layouts/Dashboard';
import OrganizationsIndex from '../features/organizations';
import OrganizationIndex from '@/features/organization';
// const AuthLayout = lazy(() => import('@/features/layouts/AuthLayout'));
// const SignIn = lazy(() => import('@/features/auth/SignIn'));
// const SignUp = lazy(() => import('@/features/auth/SignUp'));
// const ResetPassword = lazy(() => import('@/features/auth/ResetPassword'));
import AuthLayout from '../features/layouts/AuthLayout';
import SignIn from '../features/auth/SignIn';
import SignUp from '../features/auth/SignUp';
import Clusters from '@/features/clusters';
// const Profile = lazy(() => import('@/features/profile'));

const rootRoute = createRootRoute({
	component: StudioCloud,
});

// Public Auth Routes

const authLayout = createRoute({
	getParentRoute: () => rootRoute,
	id: '_authLayout',
	component: AuthLayout,
});

const signInRoute = createRoute({
	getParentRoute: () => authLayout,
	path: '/',
	component: SignIn,
});

const signUpRoute = createRoute({
	getParentRoute: () => authLayout,
	path: 'signup',
	component: SignUp,
});

// Dashboard Routes
const dashboardLayout = createRoute({
	getParentRoute: () => rootRoute,
	id: '_dashboardLayout',
	component: Dashboard,
});

// Organizations Routes
const orgsRoute = createRoute({
	getParentRoute: () => dashboardLayout,
	path: 'orgs',
	component: OrganizationsIndex,
});

const orgIndexRoute = createRoute({
	getParentRoute: () => dashboardLayout,
	path: 'orgs/$organizationId',
	component: OrganizationIndex,
});

const orgClustersRoute = createRoute({
	getParentRoute: () => orgIndexRoute,
	path: 'clusters',
	component: Clusters,
});

export const cloudRouteTree = rootRoute.addChildren([
	authLayout.addChildren([signInRoute, signUpRoute]),
	dashboardLayout.addChildren([orgsRoute.addChildren([orgIndexRoute.addChildren([orgClustersRoute])])]),
]);

// const cloudRouter = createHashRouter([
// 	{
// 		path: 'signin',
// 		Component: AuthLayout,
// 		children: [
// 			{
// 				index: true,
// 				Component: SignIn,
// 			},
// 		],
// 	},
// {
// 	path: 'signup',
// 	Component: AuthLayout,
// 	children: [
// 		{
// 			index: true,
// 			Component: SignUp,
// 		},
// 	],
// },
// {
// 	path: 'resetpassword',
// 	Component: AuthLayout,
// 	children: [
// 		{
// 			index: true,
// 			Component: ResetPassword,
// 		},
// 	],
// },
// 	{
// 		Component: Dashboard,
// 		children: [
// 			{
// 				path: 'organizations',
// 				Component: Organizations,
// 			},
// 			{
// 				path: '/',
// 				Component: Organizations,
// 			},
// 			{
// 				path: '/profile',
// 				Component: Profile,
// 			},
// 		],
// 	},
// ]);

// export default cloudRouter;

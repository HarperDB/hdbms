import { createRootRoute, createRoute } from '@tanstack/react-router';
import StudioCloud from '../StudioCloud';
import Dashboard from '../features/layouts/Dashboard';
import ProfileIndex from '@/features/profile';
import OrganizationsIndex from '../features/organizations';
import OrganizationIndex from '@/features/organization';
import ClusterIndex from '@/features/cluster';
import ClusterList from '@/features/clusters/ClustersList';
// const AuthLayout = lazy(() => import('@/features/layouts/AuthLayout'));
// const SignIn = lazy(() => import('@/features/auth/SignIn'));
// const SignUp = lazy(() => import('@/features/auth/SignUp'));
// const ResetPassword = lazy(() => import('@/features/auth/ResetPassword'));
import AuthLayout from '../features/layouts/AuthLayout';
import SignIn from '../features/auth/SignIn';
import SignUp from '../features/auth/SignUp';
import ClustersIndex from '@/features/clusters';
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

// Private Routes
const dashboardLayout = createRoute({
	getParentRoute: () => rootRoute,
	id: '_dashboardLayout',
	component: Dashboard,
});

//Profile Route
const profileRoute = createRoute({
	getParentRoute: () => dashboardLayout,
	path: 'profile',
	component: ProfileIndex,
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
	component: ClustersIndex,
});

const orgClustersListRoute = createRoute({
	getParentRoute: () => orgClustersRoute,
	path: '/list',
	component: ClusterList,
});
const orgClusterRoute = createRoute({
	getParentRoute: () => orgClustersRoute,
	path: '$clusterId',
	component: ClusterIndex,
});

export const cloudRouteTree = rootRoute.addChildren([
	authLayout.addChildren([signInRoute, signUpRoute]),
	dashboardLayout.addChildren([
		profileRoute,
		orgsRoute.addChildren([
			orgIndexRoute.addChildren([orgClustersRoute.addChildren([orgClustersListRoute, orgClusterRoute])]),
		]),
	]),
]);

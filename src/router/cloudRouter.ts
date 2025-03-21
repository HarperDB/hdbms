import { createRootRouteWithContext, createRoute } from '@tanstack/react-router';
import StudioCloud from '../StudioCloud';
import Dashboard from '@/features/layouts/Dashboard';
import ProfileIndex from '@/features/profile';
import OrganizationsIndex from '../features/organizations';
import OrganizationIndex from '@/features/organization';
import ClusterIndex from '@/features/cluster';
import ClusterList from '@/features/clusters/ClustersList';
import AuthLayout from '@/features/auth/AuthLayout';
import SignIn from '@/features/auth/SignIn';
import SignUp from '@/features/auth/SignUp';
import ForgotPassword from '@/features/auth/ForgotPassword';
import ClustersLayoutComponent from '@/features/clusters';
import OrganizationsLayout from '@/features/organizations/OrganizationsLayout';
import OrganizationLayout from '@/features/organization/OrganizationLayout';
import ClusterLayout from '@/features/cluster/ClusterLayout';
import { getOrganizationQueryOptions } from '@/features/organization/queries/getOrganizationQuery';
import { QueryClient } from '@tanstack/react-query';

const rootRoute = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
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
const forgotPasswordRoute = createRoute({
	getParentRoute: () => authLayout,
	path: 'forgotpassword',
	component: ForgotPassword,
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
const orgsLayoutRoute = createRoute({
	getParentRoute: () => dashboardLayout,
	path: 'orgs',
	component: OrganizationsLayout,
});

const orgsIndexRoute = createRoute({
	getParentRoute: () => orgsLayoutRoute,
	path: '/',
	component: OrganizationsIndex,
});

// Organization Routes
const orgLayoutRoute = createRoute({
	getParentRoute: () => orgsLayoutRoute,
	path: '$organizationId',
	loader: (opts) => {
		opts.context.queryClient.ensureQueryData(getOrganizationQueryOptions(opts.params.organizationId));
	},
	component: OrganizationLayout,
});

const orgIndexRoute = createRoute({
	getParentRoute: () => orgLayoutRoute,
	path: '/',
	component: OrganizationIndex,
});

// Organization Clusters Routes
const orgClustersLayoutRoute = createRoute({
	getParentRoute: () => orgLayoutRoute,
	path: 'clusters',
	component: ClustersLayoutComponent,
});

const orgClustersIndexRoute = createRoute({
	getParentRoute: () => orgClustersLayoutRoute,
	path: '/',
	component: ClusterList,
});

// Organization Cluster Routes
const orgClusterLayoutRoute = createRoute({
	getParentRoute: () => orgClustersLayoutRoute,
	path: '$clusterId',
	component: ClusterLayout,
});

const orgClusterIndexRoute = createRoute({
	getParentRoute: () => orgClusterLayoutRoute,
	path: '/',
	component: ClusterIndex,
});

export const cloudRouteTree = rootRoute.addChildren([
	authLayout.addChildren([signInRoute, signUpRoute, forgotPasswordRoute]),
	dashboardLayout.addChildren([
		profileRoute,
		orgsLayoutRoute.addChildren([
			orgsIndexRoute,
			orgLayoutRoute.addChildren([
				orgIndexRoute,
				orgClustersLayoutRoute.addChildren([
					orgClustersIndexRoute,
					orgClusterLayoutRoute.addChildren([orgClusterIndexRoute]),
				]),
			]),
		]),
	]),
]);

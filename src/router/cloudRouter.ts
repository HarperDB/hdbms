import { createRootRouteWithContext, createRoute } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import StudioCloud from '@/StudioCloud';
import Dashboard from '@/features/layouts/Dashboard';
import ProfileIndex from '@/features/profile';
import OrganizationsIndex from '@/features/organizations';
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
import VerifyEmail from '@/features/auth/VerifyEmail';
import ResetPassword from '@/features/auth/ResetPassword';

import { getOrganizationQueryOptions } from '@/features/organization/queries/getOrganizationQuery';
import { getClusterInfoQueryOptions } from '@/features/cluster/queries/getClusterInfoQuery';
import InstanceLayout from '@/features/instance/InstanceLayout';
import Browse from '@/features/instance/browse';

const rootRoute = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	component: StudioCloud,
});

// ***Public Auth Routes***

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

const verifyEmailRoute = createRoute({
	getParentRoute: () => authLayout,
	path: 'verifyemail',
	component: VerifyEmail,
});

const resetpasswordRoute = createRoute({
	getParentRoute: () => authLayout,
	path: 'resetpassword',
	component: ResetPassword,
});
// ***Public Auth Routes***

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
const clustersLayoutRoute = createRoute({
	getParentRoute: () => orgLayoutRoute,
	path: 'clusters',
	component: ClustersLayoutComponent,
});

const clustersIndexRoute = createRoute({
	getParentRoute: () => clustersLayoutRoute,
	path: '/',
	component: ClusterList,
});

// Organization Cluster Routes
const clusterLayoutRoute = createRoute({
	getParentRoute: () => clustersLayoutRoute,
	path: '$clusterId',
	component: ClusterLayout,
	loader: (opts) => {
		opts.context.queryClient.ensureQueryData(getClusterInfoQueryOptions(opts.params.clusterId));
	},
});

const clusterIndexRoute = createRoute({
	getParentRoute: () => clusterLayoutRoute,
	path: '/',
	component: ClusterIndex,
});

const instanceLayoutRoute = createRoute({
	getParentRoute: () => clusterLayoutRoute,
	path: 'instance/$instanceId',
	component: InstanceLayout,
});

const instanceIndexRoute = createRoute({
	getParentRoute: () => instanceLayoutRoute,
	path: '/',
	component: Browse, // Placeholder for instance details
});

export const cloudRouteTree = rootRoute.addChildren([
	authLayout.addChildren([signInRoute, signUpRoute, forgotPasswordRoute, verifyEmailRoute, resetpasswordRoute]),
	dashboardLayout.addChildren([
		profileRoute,
		orgsLayoutRoute.addChildren([
			orgsIndexRoute,
			orgLayoutRoute.addChildren([
				orgIndexRoute,
				clustersLayoutRoute.addChildren([
					clustersIndexRoute,
					clusterLayoutRoute.addChildren([clusterIndexRoute, instanceLayoutRoute.addChildren([instanceIndexRoute])]),
				]),
			]),
		]),
	]),
]);

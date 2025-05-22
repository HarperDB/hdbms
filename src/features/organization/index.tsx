import { getRouteApi, Navigate, Outlet, useMatchRoute } from '@tanstack/react-router';

const route = getRouteApi('');

function OrganizationIndex() {
	const { organizationId } = route.useParams();
	const matchRoute = useMatchRoute();
	const match = matchRoute({ to: '/orgs/$organizationId' });
	if (match) {
		return <Navigate to={`/orgs/${organizationId}/clusters`} />;
	} else {
		return <Outlet />;
	}
}

export default OrganizationIndex;

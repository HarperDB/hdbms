import { Navigate, Outlet, getRouteApi, useMatchRoute } from '@tanstack/react-router';

const route = getRouteApi('');

function ClustersIndex() {
	const { organizationId } = route.useParams();
	const matchRoute = useMatchRoute();
	const match = matchRoute({ to: '/orgs/$organizationId/clusters' });
	if (match) {
		return <Navigate to={`/orgs/${organizationId}/clusters/list`} />;
	} else {
		return <Outlet />;
	}
}

export default ClustersIndex;

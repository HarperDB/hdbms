import { Navigate, Outlet, useMatch, useMatchRoute } from '@tanstack/react-router';

function ClustersIndex() {
	//if on current route, redirect to /list
	const match = useMatch({ from: '/orgs/$organizationId/clusters', shouldThrow: false });
	if (match !== undefined) {
		return <Navigate to="/list" />;
	} else {
		return <Outlet />;
	}
}

export default ClustersIndex;

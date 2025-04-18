import instanceClient from '@/config/instanceClient';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getInstanceInfoQueryOptions } from '@/features/instance/queries/getInstanceInfoQuery';
import { Outlet, getRouteApi } from '@tanstack/react-router';

const route = getRouteApi('');

function InstanceLayout() {
	const { instanceId } = route.useParams();
	const { data: instanceInfo, isSuccess } = useSuspenseQuery(getInstanceInfoQueryOptions(instanceId));

	if (!isSuccess) {
		throw new Error('Instance info not found');
	}
	// Set the base URL for the instance client to the first FQDN of the instance
	// This allows all subsequent API calls to use the correct base URL for the instance
	instanceClient.defaults.baseURL = instanceInfo.fqdns[0];
	return (
		<>
			<nav>Instance Navbar</nav>
			<div className="px-4 md:px-8 pt-4">
				{/* Create an instance context */}
				<Outlet />
			</div>
		</>
	);
}

export default InstanceLayout;

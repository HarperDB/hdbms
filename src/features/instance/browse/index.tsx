import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Sidebar';
import { getRouteApi } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getInstanceInfoQueryOptions } from '@/features/instance/queries/getInstanceInfoQuery';
import { useRegistrationInfoMutation } from '@/features/instance/queries/operation/useRegistrationInfo';
import { useDescribeAllMutation } from '@/features/instance/queries/operation/useDescribeAll';

const route = getRouteApi('');

function Browse() {
	const { instanceId } = route.useParams();
	const { data: instanceInfo, isSuccess } = useSuspenseQuery(getInstanceInfoQueryOptions(instanceId));
	const instanceUrl = instanceInfo.fqdns[0];

	const { mutate: registrationInfo } = useRegistrationInfoMutation();
	const { mutate: describeAllInstance } = useDescribeAllMutation();

	const clickButton = async () => {
		console.log('Button clicked');
		await registrationInfo(instanceUrl);
		await describeAllInstance(instanceUrl);
	};

	// Set the base URL for the instance client to the first FQDN of the instance
	// This allows all subsequent API calls to use the correct base URL for the instance
	if (!isSuccess) {
		throw new Error('Instance info not found');
	}
	return (
		<>
			<SidebarProvider>
				<AppSidebar />
				<main className="w-full">
					<SidebarTrigger />
					<div>
						<h1 className="text-2xl text-white">Browse</h1>
						<button onClick={() => clickButton()}>Get Registration</button>
					</div>
					<p>table</p>
				</main>
			</SidebarProvider>
		</>
	);
}

export default Browse;

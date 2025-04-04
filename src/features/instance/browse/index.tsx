import { getRouteApi } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getInstanceInfoQueryOptions } from '@/features/instance/queries/getInstanceInfoQuery';
import { useDescribeAllMutation } from '@/features/instance/queries/operation/useDescribeAll';

const route = getRouteApi('');

function Browse() {
	const { instanceId } = route.useParams();
	const { data: instanceInfo, isSuccess } = useSuspenseQuery(getInstanceInfoQueryOptions(instanceId));
	const instanceUrl = instanceInfo.fqdns[0];

	const { mutate: describeAllInstance } = useDescribeAllMutation();

	const clickButton = async () => {
		console.log('Button clicked');
		await describeAllInstance(instanceUrl);
	};

	// Set the base URL for the instance client to the first FQDN of the instance
	// This allows all subsequent API calls to use the correct base URL for the instance
	if (!isSuccess) {
		throw new Error('Instance info not found');
	}
	return (
		<main className="w-full">
			<section>
				<h1 className="text-2xl text-white">Browse Sidebar</h1>
			</section>
			<section>
				<h2 className="text-lg text-white">Browse Table</h2>
				<button onClick={() => clickButton()}>Get describe_all</button>
			</section>
			<p>table</p>
		</main>
	);
}

export default Browse;

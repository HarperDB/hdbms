import { getRouteApi } from '@tanstack/react-router';

const route = getRouteApi('');

function ClusterIndex() {
	const { clusterId } = route.useParams();
	return (
		<div>
			{clusterId}
			<h1>Instance List</h1>
			<ul>
				<li>Instance 1</li>
				<li>Instance 2</li>
				<li>Instance 3</li>
				<li>Instance 4</li>
				<li>Instance 5</li>
			</ul>
		</div>
	);
}

export default ClusterIndex;

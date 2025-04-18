import instanceClient from '@/config/instanceClient';

import { queryOptions } from '@tanstack/react-query';

function getDescribeAllQueryOptions(instanceId: string) {
	return queryOptions({
		queryKey: [instanceId, 'describe_all'] as const,
		queryFn: () =>
			instanceClient.post('/', {
				operation: 'describe_all',
			}) as unknown /* custom type */,
	});
}

export { getDescribeAllQueryOptions };

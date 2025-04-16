import instanceClient from '@/config/instanceClient';

import { queryOptions } from '@tanstack/react-query';

function getDescribeAllQueryOptions(instanceUrl: string) {
	return queryOptions({
		queryKey: [instanceUrl, 'describe_all'] as const,
		queryFn: () =>
			instanceClient.post(instanceUrl, {
				operation: 'describe_all',
			}) as unknown /* custom type */,
	});
}

export { getDescribeAllQueryOptions };

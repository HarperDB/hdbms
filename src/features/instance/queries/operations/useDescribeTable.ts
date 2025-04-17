import instanceClient from '@/config/instanceClient';

import { queryOptions } from '@tanstack/react-query';

function getDescribeTableQueryOptions({
	instanceUrl,
	schemaName,
	tableName,
}: {
	instanceUrl: string;
	schemaName: string;
	tableName: string;
}) {
	return queryOptions({
		queryKey: [instanceUrl, 'describe_table'] as const,
		queryFn: () =>
			instanceClient.post(instanceUrl, {
				operation: 'describe_table',
				schema: schemaName,
				table: tableName,
			}) as unknown /* custom type */,
	});
}

export { getDescribeTableQueryOptions };

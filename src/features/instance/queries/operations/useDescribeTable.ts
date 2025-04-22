import instanceClient from '@/config/instanceClient';

import { queryOptions } from '@tanstack/react-query';

function getDescribeTableQueryOptions({
	instanceId,
	schemaName,
	tableName,
}: {
	instanceId: string;
	schemaName: string;
	tableName: string;
}) {
	return queryOptions({
		queryKey: [instanceId, 'describe_table'] as const,
		queryFn: () =>
			instanceClient.post('/', {
				operation: 'describe_table',
				schema: schemaName,
				table: tableName,
			}) as unknown /* custom type */,
		enabled: !!instanceId && !!schemaName && !!tableName,
	});
}

export { getDescribeTableQueryOptions };

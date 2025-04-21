import instanceClient from '@/config/instanceClient';

import { queryOptions } from '@tanstack/react-query';

function getDropDatabaseQuery({ instanceId, databaseName }: { instanceId: string; databaseName: string }) {
	return queryOptions({
		queryKey: [instanceId, 'drop_database'] as const,
		queryFn: () =>
			instanceClient.post('/', {
				operation: 'drop_database',
				database: databaseName,
			}),
	});
}

export { getDropDatabaseQuery };

import instanceClient from '@/config/instanceClient';

import { queryOptions } from '@tanstack/react-query';

type ReadLogFilters = {
	limit: 10 | 100 | 250 | 500 | 1000;
	level: 'notify' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
	from: Date;
	until: Date;
	order: 'desc' | 'asc';
};

function getReadLogQueryOptions({
	instanceId,
	readLogFilters,
}: {
	instanceId: string;
	readLogFilters: ReadLogFilters;
}) {
	return queryOptions({
		queryKey: [instanceId, 'read_log'] as const,
		queryFn: () =>
			instanceClient.post('/', {
				operation: 'read_log',
				start: 0,
				limit: 100,
				...readLogFilters,
			}) as unknown,
		enabled: !!instanceId,
	});
}

export { getReadLogQueryOptions };

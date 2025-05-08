import instanceClient from '@/config/instanceClient';

import { queryOptions } from '@tanstack/react-query';

type LogFilters = {
	limit: 10 | 100 | 250 | 500 | 1000;
	level: 'notify' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
	from: Date;
	until: Date;
	order: 'desc' | 'asc';
};

function getReadLogQueryOptions({ instanceId, logFilters }: { instanceId: string; logFilters: LogFilters }) {
	return queryOptions({
		queryKey: [instanceId, 'read_log'] as const,
		queryFn: () => {
			return instanceClient.post('/', {
				operation: 'read_log',
				start: 0,
				...logFilters,
			}) as unknown;
		},
		enabled: !!instanceId,
	});
}

export { getReadLogQueryOptions };

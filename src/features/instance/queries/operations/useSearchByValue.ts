import instanceClient from '@/config/instanceClient';

import { queryOptions } from '@tanstack/react-query';

type SearchConditions = {
	search_attribute: string;
	search_type: string;
	search_value: string;
};

type SearchByValueRequest = {
	conditions?: [SearchConditions];
	schema: string;
	table: string;
	search_attribute: string;
	search_value: string;
	// get_attributes: string[];
	limit: number;
	offset: number;
};
function getSearchByValueOptions({
	instanceId,
	schemaName,
	tableName,
	hash_attribute,
}: // ...options
{
	instanceId: string;
	schemaName: string;
	tableName: string;
	hash_attribute: string;
	// options?: SearchByValueRequest;
}) {
	return queryOptions({
		queryKey: [instanceId, 'search_by_value'] as const,
		queryFn: () =>
			instanceClient.post('/', {
				operation: 'search_by_value',
				get_attributes: ['*'],
				schema: schemaName,
				table: tableName,
				search_attribute: hash_attribute,
				search_value: '*',
				// ...options,
			}),
	});
}

export { getSearchByValueOptions };

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
	sort: {
		attribute: string;
		descending: boolean;
	};
};
function getSearchByValueOptions({
	instanceId,
	schemaName,
	tableName,
	hash_attribute,
	sortTableDataParams,
}: // ...options
{
	instanceId: string;
	schemaName: string;
	tableName: string;
	hash_attribute: string;
	sortTableDataParams: {
		attribute: string;
		descending: boolean;
	};
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
				sort: sortTableDataParams.attribute.length ? sortTableDataParams : undefined,
			}),
	});
}

export { getSearchByValueOptions };

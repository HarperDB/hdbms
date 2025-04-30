// TODO: Define on describe table data call
type AttributesTypes = {
	attribute: string;
	is_primary_key: boolean;
	type: string;
	indexed: boolean;
	elements: string;
};
// TODO: Define on describe table data call
type DescribeTableData = {
	hash_attribute: string;
	attributes: AttributesTypes[];
	[key: string]: unknown;
};

function formatBrowseDataTableHeader(describeTableData: DescribeTableData) {
	const { hash_attribute, attributes } = describeTableData;
	// Build out describe table data types migrate AttributeTypes to it
	const allAttributes = attributes.map((item: AttributesTypes) => item.attribute);

	const orderedColumns = allAttributes.filter(
		(attribute: string) => ![hash_attribute, '__createdtime__', '__updatedtime__'].includes(attribute)
	);

	if (allAttributes.includes('__createdtime__')) orderedColumns.push('__createdtime__');
	if (allAttributes.includes('__updatedtime__')) orderedColumns.push('__updatedtime__');

	// const dataTableColumns = (hash_attribute ? [hash_attribute, ...orderedColumns] : [...orderedColumns]).map((k) => ({
	// 	header: k === 'id' ? 'Primary Key' : k.toString(),
	// 	accessorKey: k.toString(),
	// }));
	const dataTableColumns = (hash_attribute ? [hash_attribute, ...orderedColumns] : [...orderedColumns]).map((k) => ({
		header: k === 'id' ? 'Primary Key' : k.toString(),
		accessorKey: k.toString(),
	}));

	return {
		dataTableColumns,
		hash_attribute,
	};
}

export { formatBrowseDataTableHeader };

const getTableAttributes = (attributes: string) => {
	let allAttributes: string[] = [];
	let hashAttribute = '';
	let schemaAttributes: string[] = [];
	let get_attributes = ['*'];
	let dynamicAttributesFromDataTable: string[] = [];
	let dataTableColumns: string[] = [];

	return {
		allAttributes,
		hashAttribute,
		schemaAttributes,
		get_attributes,
		dynamicAttributesFromDataTable,
		dataTableColumns,
	};
};

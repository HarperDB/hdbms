const buildInstanceDataStructure = (dbResponse) => {
	const structure = {};
	const defaultBrowseURL = [];

	if (!dbResponse.error) {
		Object.keys(dbResponse)
			.sort()
			.forEach((schema, index) => {
				structure[schema] = {};
				if (index === 0) defaultBrowseURL.push(schema);
				Object.keys(dbResponse[schema])
					.sort()
					.forEach((table, t) => {
						if (t === 0 && index === 0) defaultBrowseURL.push(table);
						structure[schema][table] = {
							record_count: dbResponse[schema][table].record_count,
							hashAttribute: dbResponse[schema][table].hash_attribute,
						};
					});
			});
	}

	return {
		structure,
		defaultBrowseURL: defaultBrowseURL.join('/'),
	};
};

export default buildInstanceDataStructure;

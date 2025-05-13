const buildInstanceDataStructure = (dbResponse) => {
	const structure = {};

	if (!dbResponse.error) {
		Object.keys(dbResponse)
			.sort()
			.forEach((schema) => {
				structure[schema] = {};
				Object.keys(dbResponse[schema])
					.sort()
					.forEach((table) => {
						structure[schema][table] = {
							record_count: dbResponse[schema][table].record_count,
							hashAttribute: dbResponse[schema][table].hash_attribute,
						};
					});
			});
	}

	return structure;
};

export default buildInstanceDataStructure;

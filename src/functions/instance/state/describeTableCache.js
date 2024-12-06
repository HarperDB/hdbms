const descriptionCache = () => {
	try {
		return new Map(JSON.parse(sessionStorage.getItem('descriptionCache')));
	} catch {
		return new Map();
	}
};

const getTableKey = (schema, table) => `${schema}/${table}`;

const getTableDescriptionFromCache = (schema, table) => {
	const tableKey = getTableKey(schema, table);
	return descriptionCache.get(tableKey) ?? null;
};

const setTableDescriptionInCache = (schema, table, description) => {
	const tableKey = getTableKey(schema, table);
	descriptionCache.set(tableKey, description);
	sessionStorage.setItem('descriptionCache', JSON.stringify(Array.from(descriptionCache)));
};

const clearTableDescriptionCache = () => {
	if (!descriptionCache.size) return;
	descriptionCache.clear();
	sessionStorage.removeItem('descriptionCache');
};

export { descriptionCache, getTableDescriptionFromCache, setTableDescriptionInCache, clearTableDescriptionCache };

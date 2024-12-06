const descriptionCache = new Map(JSON.parse(sessionStorage.getItem('descriptionCache')) || []);

const getTableKey = (schema, table) => `${schema}/${table}`;

const getTableDescriptionFromCache = (schema, table) => {
	const tableKey = getTableKey(schema, table);
	if (!descriptionCache.has(tableKey)) return null;
	return descriptionCache.get(tableKey);
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

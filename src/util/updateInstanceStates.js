export default (instances, authObject) => {
  const existingAuthObjectIndex = instances.findIndex((i) => i.auth === authObject.auth && i.url === authObject.url);
  if (existingAuthObjectIndex !== -1) instances.splice(existingAuthObjectIndex, 1);
  const newInstancesObject = [...instances.map((i) => { i.active = false; return i; }), { ...authObject, active: true }].sort((a, b) => (a.url.toLowerCase() > b.url.toLowerCase() ? 1 : -1));
  return newInstancesObject;
};

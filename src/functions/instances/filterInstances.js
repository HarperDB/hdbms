export default ({
  filterSearch,
  filterCloud,
  filterLocal,
  instances
}) => {
  if (!instances) return [];
  if (!filterCloud && !filterLocal) return [];
  if (filterSearch.search === '' && filterLocal && filterCloud) return instances;
  return instances.filter(i => {
    if (!filterLocal && i.isLocal) return false;
    if (!filterCloud && !i.isLocal) return false;
    if (filterSearch === '') return true;
    let pass = false;
    if (i.instanceName && i.instanceName.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1) pass = true;
    if (i.host && i.host.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1) pass = true;
    if (i.url && i.url.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1) pass = true;
    if (i.instanceRegion && i.instanceRegion.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1) pass = true;
    return pass;
  });
};
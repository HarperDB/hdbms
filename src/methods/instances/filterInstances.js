export default ({ filterSearch, filterCloud, filterLocal, instances }) => {
  if (!instances) return [];
  if (!filterCloud && !filterLocal) return [];
  if (filterSearch.search === '' && filterLocal && filterCloud) return instances;

  return instances.filter((i) => {
    if (!filterLocal && i.is_local) return false;
    if (!filterCloud && !i.is_local) return false;
    if (filterSearch === '') return true;

    let pass = false;
    if (i.instance_name && i.instance_name.indexOf(filterSearch) !== -1) pass = true;
    if (i.host && i.host.indexOf(filterSearch) !== -1) pass = true;
    if (i.url && i.url.indexOf(filterSearch) !== -1) pass = true;
    if (i.instance_region && i.instance_region.indexOf(filterSearch) !== -1) pass = true;
    return pass;
  });
};

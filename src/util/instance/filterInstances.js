export default ({ filters, instances }) => {
  if (!instances) return [];
  if (!filters.local && !filters.cloud) return [];
  if (filters.search === '' && filters.local && filters.cloud) return instances;

  return instances.filter((i) => {
    if (!filters.local && i.is_local) return false;
    if (!filters.cloud && !i.is_local) return false;
    if (filters.search === '') return true;

    let pass = false;
    if (i.instance_name && i.instance_name.indexOf(filters.search) !== -1) pass = true;
    if (i.host && i.host.indexOf(filters.search) !== -1) pass = true;
    if (i.domain_name && i.domain_name.indexOf(filters.search) !== -1) pass = true;
    return pass;
  });
};

export default ({ local, cloud, search, instances }) => {
  if (!local && !cloud) return [];
  if (search === '' && local && cloud) return instances;

  return instances.filter((i) => {
    if (!local && i.is_local) return false;
    if (!cloud && !i.is_local) return false;
    if (search === '') return true;

    let pass = false;
    if (i.instance_name && i.instance_name.indexOf(search) !== -1) pass = true;
    if (i.host && i.host.indexOf(search) !== -1) pass = true;
    if (i.domain_name && i.domain_name.indexOf(search) !== -1) pass = true;
    return pass;
  });
};

export default ({ orgSearch, orgs }) => {
  if (!orgs) return [];
  if (!orgSearch || orgSearch === '') return orgs;

  return orgs.filter((i) => i.customer_name && i.customer_name.indexOf(orgSearch) !== -1);
};

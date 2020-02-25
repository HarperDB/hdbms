import queryLMS from '../queryLMS';

export default async ({ auth }) => {
  const newProducts = await queryLMS({
    endpoint: 'getProducts',
    method: 'POST',
    auth,
  });
  return {
    raw: newProducts,
    local: newProducts.map((p) => ({ label: `${p.instance_ram}GB RAM | ${p.instance_disk_space_gigs}GB Disk Space | ${p.local_price_annual ? `$${p.local_price_annual}/yr` : 'FREE'}`, value: p.stripe_product_id })),
    cloud: newProducts.map((p) => ({ label: `${p.instance_ram}GB RAM | ${p.instance_disk_space_gigs}GB Disk Space | ${p.cloud_price_monthly ? `$${p.cloud_price_monthly}/mo` : 'FREE'}`, value: p.stripe_product_id })),
  };
};

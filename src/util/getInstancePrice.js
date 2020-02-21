export default ({ products, instanceDetails }) => {
  const selectedProduct = products.find((p) => p.stripe_product_id === instanceDetails.stripe_product_id);
  return instanceDetails.is_local ? selectedProduct.local_price_annual : selectedProduct.cloud_price_monthly;
};

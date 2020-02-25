export default (customer) => customer?.stripe_customer_object?.sources?.data?.[0];

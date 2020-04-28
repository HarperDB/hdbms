import queryLMS from '../queryLMS';

export default async ({ auth, customer_id, coupon_code }) => {
  const response = await queryLMS({
    endpoint: 'addCoupon',
    method: 'POST',
    auth,
    payload: { customer_id, coupon_code },
  });

  return response;
};

import queryLMS from '../queryLMS';
export default async ({
  auth,
  customerId,
  couponCode
}) => queryLMS({
  endpoint: 'addCoupon',
  method: 'POST',
  auth,
  payload: {
    customerId,
    couponCode,
    userId: auth.userId
  }
});
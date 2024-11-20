import queryLMS from '../queryLMS';
export default async ({
  auth,
  customerId,
  computeStackId,
  name,
  type,
  query,
  labelAttribute,
  seriesAttributes,
  shared
}) => queryLMS({
  endpoint: 'addChart',
  method: 'POST',
  auth,
  payload: {
    userId: auth.userId,
    customerId,
    computeStackId,
    name,
    type,
    query,
    labelAttribute,
    seriesAttributes,
    shared
  }
});
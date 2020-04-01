import queryLMS from '../queryLMS';

export default async ({ auth, payload: { user_id, tc_version, customer_id } }) => {
  const response = await queryLMS({
    endpoint: 'addTCAcceptance',
    method: 'POST',
    payload: {
      user_id,
      tc_version,
      customer_id,
    },
    auth,
  });

  return response.body;
};

import queryLMS from '../queryLMS';
export default async ({
  auth,
  customerId,
  computeStackId,
  isVerizon,
  isAkamai
}) => queryLMS({
  endpoint: isVerizon ? 'wl/removeWavelengthInstance' : isAkamai ? 'removeAkamaiInstance' : 'removeInstance',
  method: 'POST',
  payload: {
    customerId,
    computeStackId,
    computeStackWlId: computeStackId
  },
  auth
});
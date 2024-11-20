const chooseCompute = ({
  isLocal,
  wavelengthZoneId,
  cloudProvider
}) => {
  switch (true) {
    case wavelengthZoneId:
      return 'wavelength_compute';
    case isLocal:
      return 'local_compute';
    case cloudProvider === 'akamai':
      return 'akamai_compute';
    default:
      return 'cloud_compute';
  }
};
export default chooseCompute;
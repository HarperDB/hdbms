const generateTypeString = ({
  wavelengthZoneId,
  isLocal,
  cloudProvider
}) => {
  switch (true) {
    case wavelengthZoneId:
      return 'HARPERDB CLOUD - VERIZON 5G';
    case isLocal:
      return 'HARPERDB ENTERPRISE - USER MANAGED';
    case cloudProvider === 'akamai':
      return 'HARPERDB CLOUD - AKAMAI';
    default:
      return 'HARPERDB CLOUD - AWS';
  }
};
export default generateTypeString;
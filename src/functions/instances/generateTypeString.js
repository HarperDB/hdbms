const generateTypeString = ({ wavelength_zone_id, is_local, cloud_provider }) => {
  switch (true) {
    case wavelength_zone_id:
      return 'HARPERDB CLOUD - VERIZON 5G';
    case is_local:
      return 'HARPERDB ENTERPRISE - USER MANAGED';
    case cloud_provider === 'akamai':
      return 'HARPERDB CLOUD - AKAMAI';
    default:
      return 'HARPERDB CLOUD - AWS';
  }
};

export default generateTypeString;

import config from '../../config';
export default ({
  apiVersion
}) => {
  if (apiVersion) {
    let showVersionAlert = false;
    try {
      const localVersionArray = config.studioVersion.split('.');
      const apiVersionArray = apiVersion.split('.');
      const majorVersionUpdate = parseInt(localVersionArray[0], 10) < parseInt(apiVersionArray[0], 10);
      const minorVersionUpdate = parseInt(localVersionArray[0], 10) === parseInt(apiVersionArray[0], 10) && parseInt(localVersionArray[1], 10) < parseInt(apiVersionArray[1], 10);
      const patchVersionUpdate = parseInt(localVersionArray[0], 10) === parseInt(apiVersionArray[0], 10) && parseInt(localVersionArray[1], 10) === parseInt(apiVersionArray[1], 10) && parseInt(localVersionArray[2], 10) < parseInt(apiVersionArray[2], 10);
      if (majorVersionUpdate || minorVersionUpdate || patchVersionUpdate) {
        showVersionAlert = apiVersion;
      }
    } catch (e) {
      return false;
    }
    return showVersionAlert;
  }
  return false;
};
import config from '../../../config';

export default ({ apiVersion }) => {
  if (apiVersion) {
    let showVersionAlert = false;

    try {
      const localVersionArray = config.studio_version.split('.');
      const apiVersionArray = apiVersion.split('.');

      for (let i = 0; i < localVersionArray.length; i += 1) {
        if (parseInt(localVersionArray[i], 10) < parseInt(apiVersionArray[i], 10)) {
          showVersionAlert = apiVersion;
        }
      }
    } catch (e) {
      return false;
    }

    return showVersionAlert;
  }
  return false;
};

export default ({ localVersion, apiVersion, alert, position }) => {
  if (apiVersion && localVersion !== apiVersion) {
    alert.info(`HarperDB Studio v${apiVersion} is now available. Refresh to update.`, { timeout: 0, position });
  }
};

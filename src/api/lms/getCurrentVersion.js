import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import config from '../../../config';

export default async () => {
  const response = await queryLMS({
    endpoint: 'getCurrentVersion',
    method: 'POST',
  });

  if (!response.number) {
    return false;
  }

  if (!response.studio) {
    response.studio = config.studio_version;
  }

  return appState.update((s) => {
    s.version = response;
  });
};

import queryLMS from '../queryLMS';
import appState from '../../state/appState';

export default async () => {
  const response = await queryLMS({
    endpoint: 'getCurrentVersion',
    method: 'POST',
  });

  if (response.body.result === false) {
    return false;
  }

  return appState.update((s) => {
    s.version = response.body;
  });
};

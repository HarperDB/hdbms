import queryLMS from '../queryLMS';
import appState from '../../state/appState';

export default async () => {
  const response = await queryLMS({
    endpoint: 'getCurrentVersion',
    method: 'POST',
  });

  if (!response.number) {
    return false;
  }

  return appState.update((s) => {
    s.version = response;
  });
};

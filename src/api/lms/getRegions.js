import queryLMS from '../queryLMS';
import appState from '../../state/appState';

export default async () => {
  const response = await queryLMS({
    endpoint: 'getRegions',
    method: 'POST',
  });

  let regions = [];

  if (Array.isArray(response)) {
    regions = response; // .sort((a, b) => (a.label < b.label ? 1 : -1));
  }

  return appState.update((s) => {
    s.regions = regions;
  });
};

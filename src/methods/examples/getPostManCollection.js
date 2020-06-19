import appState from '../../state/appState';
import config from '../../../config';

export default async () => {
  const result = await fetch(config.postman_collection_url, { mode: 'no-cors' });
  const newPostmanColection = await result.json();

  appState.update((s) => {
    s.postmanCollection = newPostmanColection;
  });
};

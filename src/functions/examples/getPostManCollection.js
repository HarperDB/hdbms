import appState from '../state/appState';
import config from '../../config';
import staticCollection from './HarperDB.postman_collection.json';

export default async () => {
  try {
    const result = await fetch(config.postman_collection_url);
    const postmanCollection = await result.json();

    appState.update((s) => {
      s.postmanCollection = postmanCollection;
    });
  } catch (e) {
    appState.update((s) => {
      s.postmanCollection = staticCollection;
    });
  }
};

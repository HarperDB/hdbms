import queryInstance from '../queryInstance';
import instanceState from '../../state/instanceState';

export default async ({ auth, url, service = null }) => {
  if (!service) {
    instanceState.update((s) => {
      s.restarting = true;
    });
  }

  queryInstance({
    operation: {
      operation: 'restart',
      service,
    },
    auth,
    url,
  });
};

import queryInstance from '../queryInstance';
import instanceState from '../../state/instanceState';

export default async ({ auth, url, signal, currentLogCount }) => {

  const logs = await queryInstance({
    operation: {
      operation: 'read_log',
      limit: 1000,
      order: 'desc',
    },
    auth,
    url,
    signal,
  });

  return instanceState.update((s) => {
    s.logs = logs.filter(log => log.message);
    s.logsError = false;
  });
};

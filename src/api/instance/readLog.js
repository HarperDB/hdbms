import queryInstance from '../queryInstance';
import instanceState from '../../state/instanceState';

export default async ({ auth, url, signal, currentLogCount }) => {
  const { file, dailyRotateFile } = await queryInstance(
    {
      operation: 'read_log',
      limit: 1000,
      order: 'desc',
    },
    auth,
    url,
    signal
  );

  const logs = file || dailyRotateFile || false;

  if (logs || !currentLogCount) {
    return instanceState.update((s) => {
      s.logs = logs || [];
      s.logsError = false;
    });
  }
  return instanceState.update((s) => {
    s.logsError = true;
  });
};

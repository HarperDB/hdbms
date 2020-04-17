import queryInstance from '../queryInstance';
import instanceState from '../../state/instanceState';

export default async ({ auth, url, signal, currentLogCount }) => {
  const { error, file, dailyRotateFile } = await queryInstance(
    {
      operation: 'read_log',
      limit: 1000,
      order: 'desc',
    },
    auth,
    url,
    signal
  );

  if (error && currentLogCount) {
    return instanceState.update((s) => {
      s.logsError = true;
    });
  }

  if (error) {
    return instanceState.update((s) => {
      s.logs = [];
      s.logsError = true;
    });
  }

  const logs = file || dailyRotateFile;

  return instanceState.update((s) => {
    s.logs = (Array.isArray(logs) && logs.filter((l) => l.message)) || [];
    s.logsError = false;
  });
};

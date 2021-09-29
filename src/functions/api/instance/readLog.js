import queryInstance from '../queryInstance';
import instanceState from '../../state/instanceState';

export default async ({ auth, url, signal, currentLogCount }) => {
  const { error, file, dailyRotateFile } = await queryInstance({
    operation: {
      operation: 'read_log',
      limit: 1000,
      order: 'desc',
    },
    auth,
    url,
    signal,
  });

  if (error && currentLogCount) {
    return instanceState.update((s) => {
      s.logsError = error;
    });
  }

  if (error) {
    return instanceState.update((s) => {
      s.logs = [];
      s.logsError = error;
    });
  }

  const logs = file || dailyRotateFile;
  const filteredLogs = (Array.isArray(logs) && logs.filter((l) => l.message)) || [];

  return instanceState.update((s) => {
    s.logs = filteredLogs;
    s.logsError = false;
  });
};

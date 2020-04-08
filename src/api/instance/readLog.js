import queryInstance from '../queryInstance';

const logMessagesToIgnore = [
  'ERROR on HDB Client socket: SocketProtocolError: Client connection establishment timed out',
  'Connected to cluster server.',
  'Error in server socket: SocketProtocolError: Socket hung up',
  'ERROR on HDB Client socket: SocketProtocolError: Socket hung up',
  'Disconnected from cluster server with code: 1000 - SUCCESSFUL_SHUTDOWN',
  '{"ip":"::1", "error":"undefined"',
];

export default async ({ auth, url }) => {
  const { file, dailyRotateFile } = await queryInstance(
    {
      operation: 'read_log',
      limit: 1000,
      order: 'desc',
    },
    auth,
    url
  );

  const result = file || dailyRotateFile || false;

  return Array.isArray(result) ? result.filter((l) => !logMessagesToIgnore.includes(l.message) && l.message.indexOf('Got a duplicate child started event for pid') === -1) : [];
};

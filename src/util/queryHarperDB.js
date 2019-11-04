export default async (connection, operation, refresh = false) => {
  const response = await fetch(
    `${connection.HDB_SSL ? 'https://' : 'http://'}${connection.HDB_HOST || 'localhost'}:${connection.HDB_PORT || '9925'}`,
    {
      method: 'POST',
      body: JSON.stringify(operation),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${connection.HDB_USER}:${connection.HDB_PASS}`)}`,
      },
    }
  );

  if (typeof refresh === 'function') refresh(new Date());

  return await response.json();
};

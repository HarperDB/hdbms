export default ({ url, auth, body }) => `wget --no-check-certificate --quiet \\
  --method POST \\
  --timeout=0 \\
  --header 'Content-Type: application/json' \\
  --header 'Authorization: Basic ${auth}' \\
  --body-data '${body}' \\
   '${url}'`;

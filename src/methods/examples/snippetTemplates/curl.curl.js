export default ({ url, auth, body }) => `curl --location --request POST '${url}' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Basic ${auth}' \\
--data-raw '${body}'`;

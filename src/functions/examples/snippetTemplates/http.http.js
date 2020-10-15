export default ({ url, auth, body }) => `POST / HTTP/1.1
Host: ${url.split('//')[1]}
Content-Type: application/json
Authorization: Basic ${auth}

${body}`;

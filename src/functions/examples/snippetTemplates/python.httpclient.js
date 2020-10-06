export default ({ url, auth, body }) => `import http.client
import mimetypes
conn = http.client.HTTPSConnection("${url}")
payload = ${JSON.stringify(body)}
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Basic ${auth}'
}
conn.request("POST", "", payload, headers)
res = conn.getresponse()
data = res.read()
print(data.decode("utf-8"))`;

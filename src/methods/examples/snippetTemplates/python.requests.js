export default ({ url, auth, body }) => `import requests

url = "${url}"

payload = ${JSON.stringify(body)}
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Basic ${auth}'
}

response = requests.request("POST", url, headers=headers, data = payload)

print(response.text.encode('utf8'))`;

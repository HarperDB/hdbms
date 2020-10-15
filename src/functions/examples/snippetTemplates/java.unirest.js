export default ({ url, auth, body }) => `Unirest.setTimeouts(0, 0);
HttpResponse<String> response = Unirest.post("${url}")
  .header("Content-Type", "application/json")
  .header("Authorization", "Basic ${auth}")
  .body(${JSON.stringify(body)})
  .asString();`;

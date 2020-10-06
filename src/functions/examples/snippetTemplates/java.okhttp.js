export default ({ url, auth, body }) => `OkHttpClient client = new OkHttpClient().newBuilder()
  .build();
MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, ${JSON.stringify(body)});
Request request = new Request.Builder()
  .url("${url}")
  .method("POST", body)
  .addHeader("Content-Type", "application/json")
  .addHeader("Authorization", "Basic ${auth}")
  .build();
Response response = client.newCall(request).execute();`;

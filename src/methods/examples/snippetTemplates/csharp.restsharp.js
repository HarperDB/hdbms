export default ({ url, auth, body }) => `var client = new RestClient("${url}");
client.Timeout = -1;
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddHeader("Authorization", "Basic ${auth}");
request.AddParameter("application/json", ${JSON.stringify(body)},  ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
Console.WriteLine(response.Content);`;

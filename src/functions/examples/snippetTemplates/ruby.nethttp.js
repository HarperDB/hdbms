export default ({ url, auth, body }) => `require "uri"
require "net/http"

url = URI("${url}")

http = Net::HTTP.new(url.host, url.port);
request = Net::HTTP::Post.new(url)
request["Content-Type"] = "application/json"
request["Authorization"] = "Basic ${auth}"
request.body = ${JSON.stringify(body)}

response = http.request(request)
puts response.read_body`;

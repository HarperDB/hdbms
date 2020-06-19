export default [
  {
    lang: 'csharp',
    variant: 'RestSharp',
    syntax_mode: 'csharp',
    snippet: ({ url, auth, body }) => `var client = new RestClient("${url}");
client.Timeout = -1;
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddHeader("Authorization", "Basic ${auth}");
request.AddParameter("application/json", ${JSON.stringify(body)},  ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
Console.WriteLine(response.Content);`,
  },
  {
    lang: 'curl',
    variant: 'cURL',
    syntax_mode: 'bash',
    snippet: ({ url, auth, body }) => `curl --location --request POST '${url}' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Basic ${auth}' \\
--data-raw '${body}'`,
  },
  {
    lang: 'go',
    variant: 'Native',
    syntax_mode: 'go',
    snippet: ({ url, auth, body }) => `package main

import (
  "fmt"
  "strings"
  "net/http"
  "io/ioutil"
)

func main() {

  url := "${url}"
  method := "POST"

  payload := strings.NewReader(${JSON.stringify(body)})

  client := &http.Client {
  }
  req, err := http.NewRequest(method, url, payload)

  if err != nil {
    fmt.Println(err)
  }
  req.Header.Add("Content-Type", "application/json")
  req.Header.Add("Authorization", "Basic ${auth}")

  res, err := client.Do(req)
  defer res.Body.Close()
  body, err := ioutil.ReadAll(res.Body)

  fmt.Println(string(body))
}`,
  },
  {
    lang: 'http',
    variant: 'HTTP',
    syntax_mode: 'bash',
    snippet: ({ url, auth, body }) => `POST / HTTP/1.1
Host: ${url.split('//')[1]}
Content-Type: application/json
Authorization: Basic ${auth}

${body}`,
  },
  {
    lang: 'java',
    variant: 'OkHttp',
    syntax_mode: 'java',
    snippet: ({ url, auth, body }) => `OkHttpClient client = new OkHttpClient().newBuilder()
  .build();
MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, ${JSON.stringify(body)});
Request request = new Request.Builder()
  .url("${url}")
  .method("POST", body)
  .addHeader("Content-Type", "application/json")
  .addHeader("Authorization", "Basic ${auth}")
  .build();
Response response = client.newCall(request).execute();`,
  },
  {
    lang: 'java',
    variant: 'Unirest',
    syntax_mode: 'java',
    snippet: ({ url, auth, body }) => `Unirest.setTimeouts(0, 0);
HttpResponse<String> response = Unirest.post("${url}")
  .header("Content-Type", "application/json")
  .header("Authorization", "Basic ${auth}")
  .body(${JSON.stringify(body)})
  .asString();`,
  },
  {
    lang: 'JavaScript',
    variant: 'Fetch',
    syntax_mode: 'javascript',
    snippet: ({ url, auth, body }) => `var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Basic ${auth}");

var raw = JSON.stringify(${body});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("${url}", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));`,
  },
  {
    lang: 'javascript',
    variant: 'jQuery',
    syntax_mode: 'javascript',
    snippet: ({ url, auth, body }) => `var settings = {
  "url": "${url}",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Basic ${auth}"
  },
  "data": JSON.stringify(${body}),
};

$.ajax(settings).done(function (response) {
  console.log(response);
});`,
  },
  {
    lang: 'JavaScript',
    variant: 'XHR',
    syntax_mode: 'javascript',
    snippet: ({ url, auth, body }) => `var data = JSON.stringify(${body});

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function() {
  if(this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "${url}");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Authorization", "Basic ${auth}");

xhr.send(data);`,
  },
  {
    lang: 'C',
    variant: 'libcurl',
    syntax_mode: 'cpp',
    snippet: ({ url, auth, body }) => `CURL *curl;
CURLcode res;
curl = curl_easy_init();
if(curl) {
  curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "POST");
  curl_easy_setopt(curl, CURLOPT_URL, "${url}");
  curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
  curl_easy_setopt(curl, CURLOPT_DEFAULT_PROTOCOL, "https");
  struct curl_slist *headers = NULL;
  headers = curl_slist_append(headers, "Content-Type: application/json");
  headers = curl_slist_append(headers, "Authorization: Basic ${auth}");
  curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
  const char *data = ${JSON.stringify(body)};
  curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data);
  res = curl_easy_perform(curl);
}
curl_easy_cleanup(curl);`,
  },
  {
    lang: 'nodejs',
    variant: 'Request',
    syntax_mode: 'javascript',
    snippet: ({ url, auth, body }) => `var request = require('request');
var options = {
  'method': 'POST',
  'url': '${url}',
  'headers': {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ${auth}'
  },
  body: JSON.stringify(${body})

};
request(options, function (error, response) { 
  if (error) throw new Error(error);
  console.log(response.body);
});`,
  },
  {
    lang: 'nodejs',
    variant: 'Unirest',
    syntax_mode: 'javascript',
    snippet: ({ url, auth, body }) => `var unirest = require('unirest');
var req = unirest('POST', '${url}')
  .headers({
    'Content-Type': 'application/json',
    'Authorization': 'Basic ${auth}'
  })
  .send(JSON.stringify(${body}))
  .end(function (res) { 
    if (res.error) throw new Error(res.error); 
    console.log(res.raw_body);
  });`,
  },
  {
    lang: 'Objective-C',
    variant: 'NSURLSession',
    syntax_mode: 'objectivec',
    snippet: ({ url, auth, body }) => `#import <Foundation/Foundation.h>

dispatch_semaphore_t sema = dispatch_semaphore_create(0);

NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"${url}"]
  cachePolicy:NSURLRequestUseProtocolCachePolicy
  timeoutInterval:10.0];
NSDictionary *headers = @{
  @"Content-Type": @"application/json",
  @"Authorization": @"Basic ${auth}"
};

[request setAllHTTPHeaderFields:headers];
NSData *postData = [[NSData alloc] initWithData:[@${JSON.stringify(body)} dataUsingEncoding:NSUTF8StringEncoding]];
[request setHTTPBody:postData];

[request setHTTPMethod:@"POST"];

NSURLSession *session = [NSURLSession sharedSession];
NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request
completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
  if (error) {
    NSLog(@"%@", error);
  } else {
    NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *) response;
    NSError *parseError = nil;
    NSDictionary *responseDictionary = [NSJSONSerialization JSONObjectWithData:data options:0 error:&parseError];
    NSLog(@"%@",responseDictionary);
    dispatch_semaphore_signal(sema);
  }
}];
[dataTask resume];
dispatch_semaphore_wait(sema, DISPATCH_TIME_FOREVER);`,
  },
  {
    lang: 'ocaml',
    variant: 'Cohttp',
    syntax_mode: 'ocaml',
    snippet: ({ url, auth, body }) => `open Lwt
open Cohttp
open Cohttp_lwt_unix

let postData = ref ${JSON.stringify(body)};;

let reqBody = 
  let uri = Uri.of_string "${url}" in
  let headers = Header.init ()
    |> fun h -> Header.add h "Content-Type" "application/json"
    |> fun h -> Header.add h "Authorization" "Basic ${auth}"
  in
  let body = Cohttp_lwt.Body.of_string !postData in

  Client.call ~headers ~body \`POST uri >>= fun (resp, body) ->
body |> Cohttp_lwt.Body.to_string >|= fun body -> body

let () =
  let respBody = Lwt_main.run reqBody in
print_endline (respBody)`,
  },
  {
    lang: 'php',
    variant: 'cURL',
    syntax_mode: 'php',
    snippet: ({ url, auth, body }) => `<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "${url}",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS =>${JSON.stringify(body)},
  CURLOPT_HTTPHEADER => array(
    "Content-Type: application/json",
    "Authorization: Basic ${auth}"
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;`,
  },
  {
    lang: 'php',
    variant: 'HTTP_Request2',
    syntax_mode: 'php',
    snippet: ({ url, auth, body }) => `<?php
require_once 'HTTP/Request2.php';
$request = new HTTP_Request2();
$request->setUrl('${url}');
$request->setMethod(HTTP_Request2::METHOD_POST);
$request->setConfig(array(
  'follow_redirects' => TRUE
));
$request->setHeader(array(
  'Content-Type' => 'application/json',
  'Authorization' => 'Basic ${auth}'
));
$request->setBody(${JSON.stringify(body)});
try {
  $response = $request->send();
  if ($response->getStatus() == 200) {
    echo $response->getBody();
  }
  else {
    echo 'Unexpected HTTP status: ' . $response->getStatus() . ' ' .
    $response->getReasonPhrase();
  }
}
catch(HTTP_Request2_Exception $e) {
  echo 'Error: ' . $e->getMessage();
}`,
  },
  {
    lang: 'powershell',
    variant: 'RestMethod',
    syntax_mode: 'bash',
    snippet: ({ url, auth, body }) => `$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Content-Type", "application/json")
$headers.Add("Authorization", "Basic ${auth}")

$body = "${body}"

  $response = Invoke-RestMethod '${url}' -Method 'POST' -Headers $headers -Body $body
  $response | ConvertTo-Json`,
  },
  {
    lang: 'python',
    variant: 'http.client',
    syntax_mode: 'python',
    snippet: ({ url, auth, body }) => `import http.client
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
print(data.decode("utf-8"))`,
  },
  {
    lang: 'python',
    variant: 'Requests',
    syntax_mode: 'python',
    snippet: ({ url, auth, body }) => `import requests

url = "${url}"

payload = ${JSON.stringify(body)}
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Basic ${auth}'
}

response = requests.request("POST", url, headers=headers, data = payload)

print(response.text.encode('utf8'))`,
  },
  {
    lang: 'Ruby',
    variant: 'Net::HTTP',
    syntax_mode: 'ruby',
    snippet: ({ url, auth, body }) => `require "uri"
require "net/http"

url = URI("${url}")

http = Net::HTTP.new(url.host, url.port);
request = Net::HTTP::Post.new(url)
request["Content-Type"] = "application/json"
request["Authorization"] = "Basic ${auth}"
request.body = ${JSON.stringify(body)}

response = http.request(request)
puts response.read_body`,
  },
  {
    lang: 'shell',
    variant: 'Httpie',
    syntax_mode: 'bash',
    snippet: ({ url, auth, body }) => `printf '${body}'| ${url.split('://')[0]}  --follow --timeout 3600 POST ${url.split('://')[1]}/ \\
 Content-Type:'application/json' \\
 Authorization:'Basic ${auth}'`,
  },
  {
    lang: 'shell',
    variant: 'wget',
    syntax_mode: 'bash',
    snippet: ({ url, auth, body }) => `wget --no-check-certificate --quiet \\
  --method POST \\
  --timeout=0 \\
  --header 'Content-Type: application/json' \\
  --header 'Authorization: Basic ${auth}' \\
  --body-data '${body}' \\
   '${url}'`,
  },
  {
    lang: 'swift',
    variant: 'URLSession',
    syntax_mode: 'swift',
    snippet: ({ url, auth, body }) => `import Foundation

var semaphore = DispatchSemaphore (value: 0)

let parameters = ${JSON.stringify(body)}
let postData = parameters.data(using: .utf8)

var request = URLRequest(url: URL(string: "${url}")!,timeoutInterval: Double.infinity)
request.addValue("application/json", forHTTPHeaderField: "Content-Type")
request.addValue("Basic ${auth}", forHTTPHeaderField: "Authorization")

request.httpMethod = "POST"
request.httpBody = postData

let task = URLSession.shared.dataTask(with: request) { data, response, error in 
  guard let data = data else {
    print(String(describing: error))
    return
  }
  print(String(data: data, encoding: .utf8)!)
  semaphore.signal()
}

task.resume()
semaphore.wait()`,
  },
];

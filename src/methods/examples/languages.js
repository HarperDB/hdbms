import cSharpRestSharp from './snippetTemplates/csharp.restsharp';
import curlCURL from './snippetTemplates/curl.curl';
import goNative from './snippetTemplates/go.native';
import httpHTTP from './snippetTemplates/http.http';
import javaOkHttp from './snippetTemplates/java.okhttp';
import javaUnirest from './snippetTemplates/java.unirest';
import javascriptFetch from './snippetTemplates/javascript.fetch';
import javascriptjQuery from './snippetTemplates/javascript.jquery';
import javascriptXHR from './snippetTemplates/javascript.xhr';
import cLibcurl from './snippetTemplates/c.libcurl';
import nodejsRequest from './snippetTemplates/nodejs.request';
import nodejsUnirest from './snippetTemplates/nodejs.unirest';
import objectiveCNSURLSession from './snippetTemplates/objectivec.nsurlsession';
import ocamlCohttp from './snippetTemplates/ocaml.cohttp';
import phpCurl from './snippetTemplates/php.curl';
import phpHTTPRequest2 from './snippetTemplates/php.httprequest2';
import powershellRestMethod from './snippetTemplates/powershell.restmethod';
import pythonHTTPClient from './snippetTemplates/python.httpclient';
import pythonRequests from './snippetTemplates/python.requests';
import rubyNetHttp from './snippetTemplates/ruby.nethttp';
import shellHttpie from './snippetTemplates/shell.httpie';
import shellWget from './snippetTemplates/shell.wget';
import swiftURLSession from './snippetTemplates/swift.urlsession';

export default [
  { lang: 'csharp', variant: 'RestSharp', syntax_mode: 'csharp', snippet: cSharpRestSharp },
  { lang: 'curl', variant: 'cURL', syntax_mode: 'bash', snippet: curlCURL },
  { lang: 'go', variant: 'Native', syntax_mode: 'go', snippet: goNative },
  { lang: 'http', variant: 'HTTP', syntax_mode: 'bash', snippet: httpHTTP },
  { lang: 'java', variant: 'OkHttp', syntax_mode: 'java', snippet: javaOkHttp },
  { lang: 'java', variant: 'Unirest', syntax_mode: 'java', snippet: javaUnirest },
  { lang: 'JavaScript', variant: 'Fetch', syntax_mode: 'javascript', snippet: javascriptFetch },
  { lang: 'javascript', variant: 'jQuery', syntax_mode: 'javascript', snippet: javascriptjQuery },
  { lang: 'JavaScript', variant: 'XHR', syntax_mode: 'javascript', snippet: javascriptXHR },
  { lang: 'C', variant: 'libcurl', syntax_mode: 'cpp', snippet: cLibcurl },
  { lang: 'nodejs', variant: 'Request', syntax_mode: 'javascript', snippet: nodejsRequest },
  { lang: 'nodejs', variant: 'Unirest', syntax_mode: 'javascript', snippet: nodejsUnirest },
  { lang: 'Objective-C', variant: 'NSURLSession', syntax_mode: 'objectivec', snippet: objectiveCNSURLSession },
  { lang: 'ocaml', variant: 'Cohttp', syntax_mode: 'ocaml', snippet: ocamlCohttp },
  { lang: 'php', variant: 'cURL', syntax_mode: 'php', snippet: phpCurl },
  { lang: 'php', variant: 'HTTP_Request2', syntax_mode: 'php', snippet: phpHTTPRequest2 },
  { lang: 'powershell', variant: 'RestMethod', syntax_mode: 'bash', snippet: powershellRestMethod },
  { lang: 'python', variant: 'http.client', syntax_mode: 'python', snippet: pythonHTTPClient },
  { lang: 'python', variant: 'Requests', syntax_mode: 'python', snippet: pythonRequests },
  { lang: 'Ruby', variant: 'Net::HTTP', syntax_mode: 'ruby', snippet: rubyNetHttp },
  { lang: 'shell', variant: 'Httpie', syntax_mode: 'bash', snippet: shellHttpie },
  { lang: 'shell', variant: 'wget', syntax_mode: 'bash', snippet: shellWget },
  { lang: 'swift', variant: 'URLSession', syntax_mode: 'swift', snippet: swiftURLSession },
];

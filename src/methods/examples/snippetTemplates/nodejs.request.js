export default ({ url, auth, body }) => `var request = require('request');
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
});`;

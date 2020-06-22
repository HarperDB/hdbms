export default ({ url, auth, body }) => `var unirest = require('unirest');
var req = unirest('POST', '${url}')
  .headers({
    'Content-Type': 'application/json',
    'Authorization': 'Basic ${auth}'
  })
  .send(JSON.stringify(${body}))
  .end(function (res) { 
    if (res.error) throw new Error(res.error); 
    console.log(res.raw_body);
  });`;

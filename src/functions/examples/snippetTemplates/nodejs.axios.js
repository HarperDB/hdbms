export default ({ url, auth, body }) => `var axios = require('axios');
var data = JSON.stringify(${body});

var config = {
  method: 'post',
  url: '${url}',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Basic ${auth}'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});`;

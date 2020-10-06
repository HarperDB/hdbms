export default ({ url, auth, body }) => `var settings = {
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
});`;

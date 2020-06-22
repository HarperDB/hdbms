export default ({ url, auth, body }) => `printf '${body}'| ${url.split('://')[0]}  --follow --timeout 3600 POST ${url.split('://')[1]}/ \\
 Content-Type:'application/json' \\
 Authorization:'Basic ${auth}'`;

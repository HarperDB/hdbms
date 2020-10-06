export default ({ url, auth, body }) => `$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Content-Type", "application/json")
$headers.Add("Authorization", "Basic ${auth}")

$body = "${body}"

  $response = Invoke-RestMethod '${url}' -Method 'POST' -Headers $headers -Body $body
  $response | ConvertTo-Json`;

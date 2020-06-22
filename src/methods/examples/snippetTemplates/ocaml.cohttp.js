export default ({ url, auth, body }) => `open Lwt
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
print_endline (respBody)`;

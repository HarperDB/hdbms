import { RouterProvider } from "react-router";
import localRouter from "@/router/localRouter";

function LocalApp() {

  return (
    <RouterProvider router={localRouter} />
  )
}

export default LocalApp;

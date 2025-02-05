import { RouterProvider } from "react-router";
import studioRouter from "@/router/studioRouter";

function StudioApp() {

  return (
    <RouterProvider router={studioRouter} />
  )
}

export default StudioApp;

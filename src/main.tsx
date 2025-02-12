import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
// import CloudApp from "@/CloudApp";
// import LocalApp from "@/LocalApp";
import "@/index.css";

const isLocalStudio = import.meta.env.VITE_REACT_APP_LOCALSTUDIO == "true";
const LocalApp = lazy(() => import("@/LocalApp"));
const CloudApp = lazy(() => import("@/CloudApp"));

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
      {isLocalStudio ? <LocalApp /> : <CloudApp />}
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import StudioApp from "@/StudioApp";
import LocalApp from "@/LocalApp";
import "@/index.css";

const isLocalStudio = import.meta.env.VITE_REACT_APP_LOCALSTUDIO == "true";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
      {isLocalStudio ? <LocalApp /> : <StudioApp />}
  </React.StrictMode>
);

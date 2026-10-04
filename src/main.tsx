import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "./styles.css";
import App from "./App";
const container = document.getElementById("root")!;
const app = <App initialPath={window.location.pathname} />;
if (
  container.hasChildNodes() &&
  container.dataset.route === window.location.pathname.replace(/\/+$/, "") + "/"
)
  hydrateRoot(container, app);
else createRoot(container).render(app);

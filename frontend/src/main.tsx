import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Importar el proveedor centralizado de notificaciones
import { NotificationsProvider } from "@/notifications/NotificationsProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <ThemeProvider theme={theme}>
      <CssBaseline /> */}
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
    {/* </ThemeProvider> */}
  </React.StrictMode>
);

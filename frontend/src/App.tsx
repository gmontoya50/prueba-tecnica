// src/App.tsx
import { useEffect, useState } from "react";
import config from "./config";
import "./styles.css";

function App() {
  const [title, setTitle] = useState<string>(config.appName);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ejemplo de carga inicial segura
    async function init() {
      try {
        // si necesitas leer del backend:
        // const data = await get("/health");
        // setTitle(data?.name || config.appName);
        setTitle((prev) => prev || config.appName);
      } catch (e: any) {
        setError(e?.message || "Error inicializando la app");
      }
    }
    init();
  }, []);

  return (
    <div className="app">
      <header className="app__header">
        <h1>{title || "App"}</h1>
      </header>
      <main className="app__main">
        {error ? (
          <div className="error">
            <strong>Ocurrió un error:</strong> {error}
          </div>
        ) : (
          <div>Contenido cargado ✅</div>
        )}
      </main>
    </div>
  );
}

export default App;

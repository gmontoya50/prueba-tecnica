// src/App.tsx
import "./styles.css";
import TodosList from "./components/TodosList";

export default function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1>Todos</h1>
      </header>
      <main className="app__main">
        <TodosList />
      </main>
    </div>
  );
}

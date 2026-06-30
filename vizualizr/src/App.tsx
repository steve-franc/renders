import { BrowserRouter, Routes, Route } from "react-router-dom";
import PasswordGate from "./components/PasswordGate";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import ClientView from "./pages/ClientView";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/p/:slug" element={<ClientView />} />
        <Route
          path="/"
          element={
            <PasswordGate>
              <Dashboard />
            </PasswordGate>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <PasswordGate>
              <Editor />
            </PasswordGate>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

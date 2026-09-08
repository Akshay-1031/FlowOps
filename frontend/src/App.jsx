import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import Tasks from "./pages/Tasks";
import AIInsights from "./pages/AIInsights";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />

            <Route
              path="/projects/:projectId"
              element={<ProjectWorkspace />}
            />

            <Route path="/tasks" element={<Tasks />} />
            <Route path="/ai" element={<AIInsights />} />
          </Route>

          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
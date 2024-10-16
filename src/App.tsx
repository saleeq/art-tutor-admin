import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { MainLayout } from "./components/layout/MainLayout";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { GroupSelectionPage } from "./pages/GroupSelectionPage";
import { DashboardPage } from "./pages/DashboardPage";
import { StudentGroupsPage } from "./pages/StudentGroupsPage";

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const ProtectedGroupSelection: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <GroupSelectionPage />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Group Selection Page (protected, but outside MainLayout) */}
          <Route path="/select-group" element={<ProtectedGroupSelection />} />

          {/* Other Protected routes wrapped in MainLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/word-lists" element={<div>Word Lists Page</div>} />
              <Route path="/student-groups" element={<StudentGroupsPage />} />
              <Route path="/settings" element={<div>Settings Page</div>} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/select-group" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

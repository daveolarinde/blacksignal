// App.jsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecoveryWizardPage from './pages/recovery/RecoveryWizardPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ClientPortalPage from './pages/ClientPortalPage';
import CasePage from './pages/CasePage';           // <-- new
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/recover" element={<RecoveryWizardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/portal"
        element={
          <ProtectedRoute>
            <ClientPortalPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/case/:id"                          // <-- new
        element={
          <ProtectedRoute>
            <CasePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
    </Routes>
  );
}
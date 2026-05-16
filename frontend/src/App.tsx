import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/public/PublicLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import DashboardPage from './pages/public/DashboardPage';
import ProjectDetailPage from './pages/public/ProjectDetailPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { HoneypotsPage } from './pages/admin/HoneypotsPage';
import { HoneypotDetailPage } from './pages/admin/HoneypotDetailPage';
import { AttackEventsPage } from './pages/admin/AttackEventsPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { AlertsPage } from './pages/admin/AlertsPage';
import { ThreatIntelPage } from './pages/admin/ThreatIntelPage';
import { WebhooksPage } from './pages/admin/WebhooksPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { DecoyServicesPage } from './pages/admin/DecoyServicesPage';
import { PayloadsPage } from './pages/admin/PayloadsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public pages ── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ── Protected public pages ── */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetailPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ── Protected admin pages ── */}
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/honeypots" element={<HoneypotsPage />} />
            <Route path="/admin/honeypots/:id" element={<HoneypotDetailPage />} />
            <Route path="/admin/decoy-services" element={<DecoyServicesPage />} />
            <Route path="/admin/attack-events" element={<AttackEventsPage />} />
            <Route path="/admin/payloads" element={<PayloadsPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
            <Route path="/admin/alerts" element={<AlertsPage />} />
            <Route path="/admin/threat-intel" element={<ThreatIntelPage />} />
            <Route path="/admin/webhooks" element={<WebhooksPage />} />
            <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const WorkoutLoggerPage = lazy(() => import('./pages/WorkoutLoggerPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage'));

const RouteFallback = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
            />
            <Route
              path="/log"
              element={<ProtectedRoute><WorkoutLoggerPage /></ProtectedRoute>}
            />
            <Route
              path="/log/:workoutId"
              element={<ProtectedRoute><WorkoutLoggerPage /></ProtectedRoute>}
            />
            <Route
              path="/programs"
              element={<ProtectedRoute><ProgramsPage /></ProtectedRoute>}
            />
            <Route
              path="/analytics"
              element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

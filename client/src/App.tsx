import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WorkoutLoggerPage from './pages/WorkoutLoggerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProgramsPage from './pages/ProgramsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
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
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

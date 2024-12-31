import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { SignUpForm } from './components/auth/signup-form';
import { LoginForm } from './components/auth/login-form';
import { ForgotPasswordForm } from './components/auth/forgot-password-form';
import { DashboardPage } from './pages/dashboard';
import { SettingsLayout } from './pages/settings/layout';
import { SettingsPage } from './pages/settings';
import { ExpenseCategoriesPage } from './pages/settings/expense-categories';
import UserTagsPage from './pages/settings/user-tags';
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <SignUpForm />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginForm />} />
      <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" /> : <ForgotPasswordForm />} />
      
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      
      <Route path="/settings" element={<ProtectedRoute><SettingsLayout /></ProtectedRoute>}>
        <Route index element={<SettingsPage />} />
        <Route path="expense-categories" element={<ExpenseCategoriesPage />} />
        <Route path="user-tags" element={<UserTagsPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;

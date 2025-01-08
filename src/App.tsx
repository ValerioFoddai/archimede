import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { SignUpForm } from './components/auth/signup-form';
import { LoginForm } from './components/auth/login-form';
import { ForgotPasswordForm } from './components/auth/forgot-password-form';
import { DashboardPage } from './pages/dashboard';
import { TransactionsPage } from './pages/transactions';
import { ImportPage } from './pages/transactions/import';
import { ImportBankPage } from './pages/transactions/import/[bankId]';
import { SettingsLayout } from './pages/settings/layout';
import { SettingsPage } from './pages/settings';
import { ExpenseCategoriesPage } from './pages/settings/expense-categories';
import { TagsPage } from './pages/settings/tags';
import { TestTablePage } from './pages/test-table';
import { Toaster } from './components/ui/toaster';

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
      <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
      <Route path="/transactions/import" element={<ProtectedRoute><ImportPage /></ProtectedRoute>} />
      <Route path="/transactions/import/:bankId" element={<ProtectedRoute><ImportBankPage /></ProtectedRoute>} />
      
      <Route path="/settings" element={<ProtectedRoute><SettingsLayout /></ProtectedRoute>}>
        <Route index element={<SettingsPage />} />
        <Route path="expense-categories" element={<ExpenseCategoriesPage />} />
        <Route path="tags" element={<TagsPage />} />
      </Route>

      {/* Test route for table styling */}
      <Route path="/test-table" element={<TestTablePage />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;

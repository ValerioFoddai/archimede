import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { EventEmitterContext, eventEmitter } from './lib/events';
import { SignUpForm } from './components/auth/signup-form';
import { LoginForm } from './components/auth/login-form';
import { ForgotPasswordForm } from './components/auth/forgot-password-form';
import { DashboardPage } from './pages/dashboard';
import { TransactionsPage } from './pages/transactions';
import { ImportPage } from './pages/transactions/import';
import { SettingsLayout } from './pages/settings/layout';
import { SettingsPage } from './pages/settings';
import { ExpenseCategoriesPage } from './pages/settings/expense-categories';
import { TagsPage } from './pages/settings/tags';
import TransactionRulesPage from './pages/settings/transaction-rules';
import { TestTablePage } from './pages/test-table';
import { AnalyticsPage } from './pages/analytics';
import { BudgetsPage } from './pages/budgets';
import { Toaster } from './components/ui/toaster';
import ProductNewsPage from './pages/product-news';
import { AssetsLayout } from './pages/assets/layout';
import BankAccountsPage from './pages/assets/bank-accounts';
import TestPage from './pages/assets/test';

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
      <Route path="/transactions/import/*" element={<ProtectedRoute><ImportPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/budgets" element={<ProtectedRoute><BudgetsPage /></ProtectedRoute>} />
      
      <Route path="/assets" element={<ProtectedRoute><AssetsLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/assets/bank-accounts" />} />
        <Route path="bank-accounts" element={<BankAccountsPage />} />
        <Route path="test" element={<TestPage />} />
      </Route>
      
      <Route path="/product-news" element={<ProtectedRoute><ProductNewsPage /></ProtectedRoute>} />
      
      <Route path="/settings" element={<ProtectedRoute><SettingsLayout /></ProtectedRoute>}>
        <Route index element={<SettingsPage />} />
        <Route path="expense-categories" element={<ExpenseCategoriesPage />} />
        <Route path="transaction-rules" element={<TransactionRulesPage />} />
        <Route path="tags" element={<TagsPage />} />
      </Route>

      {/* Test route for table styling */}
      <Route path="/test-table" element={<TestTablePage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <EventEmitterContext.Provider value={eventEmitter}>
          <div className="min-h-screen bg-background">
            <AppRoutes />
            <Toaster />
          </div>
        </EventEmitterContext.Provider>
      </AuthProvider>
    </Router>
  );
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';

import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/Landing/LandingPage';
import DesignPage from './pages/Customer/DesignPage';
import ProductConfigPage from './pages/Customer/ProductConfigPage';
import ProviderPage from './pages/Provider/ProviderPage';
import VendorDashboard from './pages/Provider/VendorDashboard';
import SignupPage from './pages/Signup/SignupPage';
import LoginPage from './pages/Login/LoginPage';
import CustomerDashboard from './pages/Customer/CustomerDashboard';
import OrderPage from './pages/Customer/OrderPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProfileSetupPage from './pages/Profile/ProfileSetupPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/shared/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              {/* Public / Shared Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/complete-profile" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />

              {/* Customer Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
              <Route path="/design" element={<ProtectedRoute><DesignPage /></ProtectedRoute>} />
              <Route path="/config" element={<ProtectedRoute><ProductConfigPage /></ProtectedRoute>} />
              <Route path="/order" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
              <Route path="/providers" element={<ProtectedRoute><ProviderPage /></ProtectedRoute>} />

              {/* Provider Routes */}
              <Route path="/vendor/dashboard" element={<ProtectedRoute><VendorDashboard /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';

import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/Landing/LandingPage';
import DesignPage from './pages/Customer/DesignPage';
import ProductConfigPage from './pages/Customer/ProductConfigPage';
import ProviderPage from './pages/Provider/ProviderPage';
import ProviderDashboard from './pages/Provider/ProviderDashboard';
import SignupPage from './pages/Signup/SignupPage';
import LoginPage from './pages/Login/LoginPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public / Shared Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Customer Routes */}
          <Route path="/design" element={<DesignPage />} />
          <Route path="/config" element={<ProductConfigPage />} />
          <Route path="/providers" element={<ProviderPage />} />



          {/* Provider Routes */}
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/providers" element={<ProviderPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
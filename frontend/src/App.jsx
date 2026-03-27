import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';

import LandingPage from './pages/LandingPage';
import DesignPage from './pages/DesignPage';
import ProductConfigPage from './pages/ProductConfigPage';
import ProviderPage from './pages/ProviderPage';
import ProviderDashboard from './pages/ProviderDashboard';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/design" element={<DesignPage />} />
          <Route path="/config" element={<ProductConfigPage />} />
          <Route path="/providers" element={<ProviderPage />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
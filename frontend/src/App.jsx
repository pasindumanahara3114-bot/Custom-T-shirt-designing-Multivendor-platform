import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import DesignPage from './pages/DesignPage';
import ProductConfigPage from './pages/ProductConfigPage';
import ProviderPage from './pages/ProviderPage';
import ProviderDashboard from './pages/ProviderDashboard';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/design" element={<DesignPage />} />
        <Route path="/config" element={<ProductConfigPage />} />
        <Route path="/providers" element={<ProviderPage />} />
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
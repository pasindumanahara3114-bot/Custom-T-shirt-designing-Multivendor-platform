import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="navbar">
      <h2 className="logo">PrintHub</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          <div className="theme-toggle-icons">
            <Moon size={14} />
            <Sun size={14} />
          </div>
          <div className="theme-toggle-thumb">
            {theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
          </div>
        </div>

        {isLandingPage && (
          <>
            <button className="secondaryBtn" style={{ padding: '8px 16px' }} onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="navBtn" style={{ padding: '8px 16px' }} onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
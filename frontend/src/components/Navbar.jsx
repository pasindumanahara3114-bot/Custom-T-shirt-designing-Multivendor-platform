import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="navbar">
      <h2 className="logo">PrintHub</h2>

      <div className="navLinks">
        <Link to="/">Home</Link>
        <Link to="/design">Design</Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          <div className="theme-toggle-thumb">
            {theme === 'light' ? '☀️' : '🌙'}
          </div>
        </div>

        <button className="navBtn" onClick={() => navigate('/design')}>
          Start
        </button>
      </div>
    </div>
  );
};

export default Navbar;
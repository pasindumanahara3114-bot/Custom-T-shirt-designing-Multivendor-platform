import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

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

      </div>
    </div>
  );
};

export default Navbar;
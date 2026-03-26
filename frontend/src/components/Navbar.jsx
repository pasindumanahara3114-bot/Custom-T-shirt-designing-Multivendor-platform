import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <h2 className="logo">PrintHub</h2>

      <div className="navLinks">
        <Link to="/">Home</Link>
        <Link to="/design">Design</Link>
      </div>

      <button className="navBtn" onClick={() => navigate('/design')}>
        Start
      </button>
    </div>
  );
};

export default Navbar;
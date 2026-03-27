import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <h1>Design Your Own T-Shirt</h1>
      <p>Customize • Choose Providers • Order Easily</p>

      <button onClick={() => navigate('/design')}>
        Start Designing
      </button>
    </div>
  );
};

export default Hero;
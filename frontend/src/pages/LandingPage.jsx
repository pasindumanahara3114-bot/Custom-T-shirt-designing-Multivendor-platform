import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">

      <Navbar />

      {/* HERO */}
      <section className="heroV2">
        <div className="heroContent">
          <h1>
            Build Custom Apparel <br />
            <span>with Smart Vendor Matching</span>
          </h1>

          <p>
            Design your T-shirt, configure product details, and instantly find the best vendors.
          </p>

          <div className="heroBtns">
            <button onClick={() => navigate('/design')} className="primaryBtn">
              Start Designing →
            </button>

            <button onClick={() => navigate('/provider-dashboard')} className="secondaryBtn">
              Provider Dashboard
            </button>

            <button className="secondaryBtn">
              Explore Designs
            </button>
          </div>
        </div>

        <div className="heroImage">
          <img src="/design/hero-shirt.png" alt="Tshirt Mockup" />
        </div>
      </section>

      {/* TRENDING */}
      <section className="trendingV2">
        <h2>🔥 Trending Designs</h2>

        <div className="masonry">
          <img src="/images/t1.jpg" />
          <img src="/images/t2.jpg" />
          <img src="/images/t3.jpg" />
          <img src="/images/t4.jpg" />
          <img src="/images/t5.jpg" />
          <img src="/images/t6.jpg" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="featuresV2">
        <h2>Why Choose Our Platform?</h2>

        <div className="featureGrid">
          <div className="featureCard">
            <h3>🎨 Design Tool</h3>
            <p>Interactive Fabric.js canvas with real-time preview.</p>
          </div>

          <div className="featureCard">
            <h3>🤖 Smart Matching</h3>
            <p>Filter vendors based on material & quantity rules.</p>
          </div>

          <div className="featureCard">
            <h3>⚡ Fast Workflow</h3>
            <p>Design → Configure → Select → Order seamlessly.</p>
          </div>

          <div className="featureCard">
            <h3>🏪 Multi Vendor</h3>
            <p>Compare multiple providers instantly.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="stepsV2">
        <h2>How It Works</h2>

        <div className="stepGrid">
          <div className="stepCard">
            <h3>1. Design</h3>
            <p>Create your custom T-shirt</p>
          </div>

          <div className="stepCard">
            <h3>2. Configure</h3>
            <p>Select material, size, quantity</p>
          </div>

          <div className="stepCard">
            <h3>3. Match</h3>
            <p>Get filtered vendors instantly</p>
          </div>

          <div className="stepCard">
            <h3>4. Order</h3>
            <p>Choose provider & place order</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ctaV2">
        <h2>Start Creating Your Custom Apparel</h2>
        <button onClick={() => navigate('/design')}>
          Start Now 🚀
        </button>
      </section>

    </div>
  );
};

export default LandingPage;
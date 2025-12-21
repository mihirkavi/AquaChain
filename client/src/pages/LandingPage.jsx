import { Droplets, Shield, Wifi, Activity, BarChart3, Link2, Users, Building2, Home } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="container nav-wrapper">
          <div className="logo">
            <Droplets size={32} className="logo-icon" />
            <span className="logo-text">AquaChain</span>
          </div>
          <div className="nav-buttons">
            <button className="btn btn-outline" onClick={() => onNavigate('login')}>
              Sign In
            </button>
            <button className="btn btn-primary" onClick={() => onNavigate('register')}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="gradient-text">Blockchain-Powered</span>
              <br />Water Quality Monitoring
            </h1>
            <p className="hero-subtitle">
              Connect your smart sensors, monitor water quality in real-time, and record every reading 
              on the Ethereum blockchain for complete transparency and trust.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-lg" onClick={() => onNavigate('register')}>
                Start Monitoring
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                Learn More
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">100%</div>
                <div className="stat-label">Transparent</div>
              </div>
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Monitoring</div>
              </div>
              <div className="stat">
                <div className="stat-number">Blockchain</div>
                <div className="stat-label">Secured</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Smart Water Management</h2>
          <p className="section-subtitle">Everything you need to monitor, purify, and verify water quality</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Activity size={32} />
              </div>
              <h3>Real-Time Monitoring</h3>
              <p>Track pH, TDS, turbidity, temperature, and more with live sensor data updates every 10 seconds.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Link2 size={32} />
              </div>
              <h3>Blockchain Records</h3>
              <p>Every water quality reading is permanently recorded on the Ethereum blockchain for immutable verification.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Wifi size={32} />
              </div>
              <h3>WiFi Connected Sensors</h3>
              <p>Our smart sensors connect to your WiFi network and automatically transmit readings to the cloud.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>Built-In Purification</h3>
              <p>Each sensor unit includes an integrated water purification system that you can control remotely.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <BarChart3 size={32} />
              </div>
              <h3>Analytics Dashboard</h3>
              <p>Visualize trends, set alerts, and track water quality over time with comprehensive analytics.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>Multi-User Access</h3>
              <p>Business accounts can manage multiple sensors and locations with role-based access control.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="solutions-section">
        <div className="container">
          <h2 className="section-title">Solutions for Everyone</h2>
          <p className="section-subtitle">Whether you're a homeowner or a business, we have you covered</p>
          
          <div className="solutions-grid">
            <div className="solution-card household">
              <div className="solution-icon">
                <Home size={48} />
              </div>
              <h3>For Households</h3>
              <p>Monitor and purify your home's water supply with a single smart sensor unit.</p>
              <ul>
                <li>Easy plug-and-play setup</li>
                <li>Mobile app notifications</li>
                <li>Automatic purification</li>
                <li>Monthly quality reports</li>
              </ul>
              <button className="btn btn-primary" onClick={() => onNavigate('register')}>
                Get Started
              </button>
            </div>
            
            <div className="solution-card business">
              <div className="solution-icon">
                <Building2 size={48} />
              </div>
              <h3>For Businesses</h3>
              <p>Enterprise-grade water monitoring across multiple locations with compliance reporting.</p>
              <ul>
                <li>Unlimited sensor connections</li>
                <li>Compliance documentation</li>
                <li>API integration</li>
                <li>Priority support</li>
              </ul>
              <button className="btn btn-primary" onClick={() => onNavigate('register')}>
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="blockchain-section">
        <div className="container">
          <h2 className="section-title">Powered by Ethereum</h2>
          <p className="section-subtitle">Immutable, transparent, and verifiable water quality data</p>
          
          <div className="blockchain-flow">
            <div className="flow-step">
              <div className="step-number">1</div>
              <h4>Sensor Reads</h4>
              <p>Smart sensors measure water quality parameters</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-number">2</div>
              <h4>Data Transmitted</h4>
              <p>Readings sent via WiFi to AquaChain servers</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-number">3</div>
              <h4>Blockchain Record</h4>
              <p>Data recorded on Ethereum as smart contract</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-number">4</div>
              <h4>Verified Forever</h4>
              <p>Immutable proof of water quality history</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of users who trust AquaChain for their water quality monitoring needs.</p>
          <div className="cta-buttons">
            <button className="btn btn-white btn-lg" onClick={() => onNavigate('register')}>
              Create Free Account
            </button>
            <button className="btn btn-outline-white btn-lg" onClick={() => onNavigate('login')}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <Droplets size={24} />
                <span>AquaChain</span>
              </div>
              <p>Blockchain technology for clean water management</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#">Features</a>
                <a href="#">Pricing</a>
                <a href="#">API</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Blog</a>
                <a href="#">Careers</a>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <a href="#">Documentation</a>
                <a href="#">Contact</a>
                <a href="#">Status</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 AquaChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

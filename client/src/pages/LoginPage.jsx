import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Droplets, Mail, Lock, ArrowLeft } from 'lucide-react';

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDemoLogin() {
    setEmail('demo@aquachain.com');
    setPassword('demo123');
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <button className="back-button" onClick={() => onNavigate('landing')}>
          <ArrowLeft size={20} />
          Back
        </button>
        
        <div className="auth-header">
          <div className="logo">
            <Droplets size={40} className="logo-icon" />
            <span className="logo-text">AquaChain</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to access your water monitoring dashboard</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail size={20} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={20} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button className="btn btn-outline btn-full" onClick={handleDemoLogin}>
          Use Demo Account
        </button>

        <p className="auth-footer">
          Don't have an account?{' '}
          <button className="link-button" onClick={() => onNavigate('register')}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

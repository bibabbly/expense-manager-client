import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, User, Mail, Lock, ArrowRight, Eye, EyeOff, UserPlus } from 'lucide-react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const payload = { username, email, password };
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, payload);

      console.log('Signup success:', response.data);
      toast.success('Welcome to ExpenseFlow! 🎉 Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}>
        <div style={styles.circle1}></div>
        <div style={styles.circle2}></div>
        <div style={styles.circle3}></div>
      </div>
      
      <div style={styles.formCard} className="animate-fadeInUp">
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <TrendingUp size={32} style={{ color: '#667eea' }} />
            <span style={styles.logoText}>ExpenseFlow</span>
          </div>
          <h2 style={styles.title}>Join ExpenseFlow</h2>
          <p style={styles.subtitle}>Create your account and start managing your finances</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <div style={styles.inputWrapper}>
              <User size={20} style={styles.inputIcon} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={styles.input}
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={20} style={styles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={20} style={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                style={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.button,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? (
              <div style={styles.loadingSpinner} className="animate-pulse">
                Creating Account...
              </div>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerText}>Already have an account?</span>
          </div>

          <Link to="/login" style={styles.loginLink} className="btn btn-outline">
            Sign In Instead
          </Link>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    position: 'relative',
    padding: '2rem',
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 0,
  },
  circle1: {
    position: 'absolute',
    top: '15%',
    left: '10%',
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(10px)',
  },
  circle2: {
    position: 'absolute',
    bottom: '10%',
    right: '15%',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
  },
  circle3: {
    position: 'absolute',
    top: '40%',
    right: '5%',
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  formCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    padding: '3rem',
    borderRadius: '24px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '450px',
    position: 'relative',
    zIndex: 1,
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    color: '#9ca3af',
    zIndex: 1,
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem 0.875rem 3rem',
    fontSize: '1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
  },
  eyeButton: {
    position: 'absolute',
    right: '1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    padding: '0.25rem',
    borderRadius: '6px',
    transition: 'color 0.2s ease',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minHeight: '52px',
  },
  loadingSpinner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0.5rem 0',
  },
  dividerText: {
    color: '#6b7280',
    fontSize: '0.875rem',
  },
  loginLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.875rem',
    fontSize: '1rem',
    fontWeight: '600',
    textDecoration: 'none',
    color: '#764ba2',
    background: 'rgba(118, 75, 162, 0.1)',
    border: '2px solid rgba(118, 75, 162, 0.2)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
  }
};

// Add focus styles
const focusStyles = `
  input:focus {
    outline: none;
    border-color: #764ba2 !important;
    box-shadow: 0 0 0 3px rgba(118, 75, 162, 0.1) !important;
  }
  
  input:focus + button {
    color: #764ba2 !important;
  }
  
  .eye-button:hover {
    color: #764ba2 !important;
  }
  
  .login-link:hover {
    background: rgba(118, 75, 162, 0.15) !important;
    border-color: rgba(118, 75, 162, 0.3) !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = focusStyles;
  document.head.appendChild(styleSheet);
}

export default Signup;

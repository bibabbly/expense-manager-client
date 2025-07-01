import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, Plus, FolderOpen, TrendingUp } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.left}>
          <div style={styles.logo}>
            <TrendingUp size={28} style={{ color: '#fff' }} />
            <span style={styles.logoText}>ExpenseFlow</span>
          </div>
          
          <div style={styles.navLinks}>
            <Link to="/dashboard" style={styles.link}>
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/add-expense" style={styles.link}>
              <Plus size={18} />
              <span>Add Expense</span>
            </Link>
            <Link to="/categories" style={styles.link}>
              <FolderOpen size={18} />
              <span>Categories</span>
            </Link>
          </div>
        </div>
        
        <div style={styles.right}>
          <button onClick={handleLogout} style={styles.logout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.25rem',
    fontWeight: '700',
  },
  logoText: {
    background: 'linear-gradient(45deg, #ffffff, #e0e7ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: '#fff',
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  logout: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '0.75rem 1rem',
    fontWeight: '500',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  right: {}
};

// Add hover effects via CSS-in-JS
const hoverStyles = `
  nav a:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  nav button:hover {
    background: rgba(255, 255, 255, 0.25) !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = hoverStyles;
  document.head.appendChild(styleSheet);
}

export default Navbar;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/add-expense" style={styles.link}>Add Expense</Link>
      </div>
      <div style={styles.right}>
        <button onClick={handleLogout} style={styles.logout}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  link: {
    marginRight: '1rem',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  logout: {
    backgroundColor: '#fff',
    color: '#007bff',
    border: 'none',
    padding: '0.5rem 1rem',
    fontWeight: 'bold',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  left: {
    display: 'flex',
    alignItems: 'center'
  },
  right: {}
};

export default Navbar;

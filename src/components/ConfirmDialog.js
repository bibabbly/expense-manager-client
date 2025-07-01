import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div style={styles.iconContainer}>
          <AlertTriangle size={48} style={{ color: '#f59e0b' }} />
        </div>
        
        <h3 style={styles.title}>Confirm Action</h3>
        <p style={styles.message}>{message}</p>
        
        <div style={styles.buttons}>
          <button 
            onClick={onCancel} 
            style={styles.cancel}
            className="btn btn-outline"
          >
            <X size={18} />
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            style={styles.confirm}
            className="btn"
          >
            <Check size={18} />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, 
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
    animation: 'fadeIn 0.2s ease-out',
  },
  dialog: {
    background: 'var(--gradient-card)',
    padding: '2.5rem',
    borderRadius: 'var(--radius-xl)',
    minWidth: '400px',
    maxWidth: '500px',
    boxShadow: 'var(--shadow-xl)',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    animation: 'slideInScale 0.3s ease-out',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    padding: '1rem',
    borderRadius: '50%',
    background: 'rgba(245, 158, 11, 0.1)',
    width: '80px',
    height: '80px',
    margin: '0 auto 1.5rem',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--gray-900)',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1rem',
    color: 'var(--gray-700)',
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  cancel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.5rem',
    background: 'white',
    color: 'var(--gray-700)',
    border: '2px solid var(--gray-300)',
    borderRadius: 'var(--radius-lg)',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  confirm: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.5rem',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: 'var(--shadow-md)',
  }
};

// Add animations
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideInScale {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  .btn:hover {
    transform: translateY(-2px);
  }
  
  .confirm-cancel:hover {
    background: var(--gray-50) !important;
    border-color: var(--gray-400) !important;
  }
  
  .confirm-confirm:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
    box-shadow: var(--shadow-lg) !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = animationStyles;
  document.head.appendChild(styleSheet);
}

export default ConfirmDialog;

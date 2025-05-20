import React from 'react';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <p>{message}</p>
        <div style={styles.buttons}>
          <button onClick={onConfirm} style={styles.confirm}>Yes</button>
          <button onClick={onCancel} style={styles.cancel}>No</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  dialog: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    minWidth: '300px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  buttons: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem'
  },
  confirm: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  cancel: {
    backgroundColor: '#ccc',
    color: '#000',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default ConfirmDialog;

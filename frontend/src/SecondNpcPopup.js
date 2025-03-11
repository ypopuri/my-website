// src/SecondNpcPopup.js
import React from 'react';

const SecondNpcPopup = ({ onYes, onNo }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h3>Do you want to check Yashwanth's skills and technologies?</h3>
        <div style={styles.buttonContainer}>
          <button style={styles.yesButton} onClick={onYes}>Yes</button>
          <button style={styles.noButton} onClick={onNo}>No</button>
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
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '300px',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  yesButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  noButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default SecondNpcPopup;
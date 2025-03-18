// LoadingScreen.js
import React from 'react';

const LoadingScreen = ({ progress }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '24px',
        zIndex: 1000,
      }}
    >
      <div>
        Loading... {Math.round(progress)}%
      </div>
    </div>
  );
};

export default LoadingScreen;
import React from 'react';

const LoadingScreen = ({ progress }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: '24px',
      zIndex: 1000,
    }}>
      <p>Loading... {Math.round(progress)}%</p>
    </div>
  );
};

export default LoadingScreen;
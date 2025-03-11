import React from 'react';
import WelcomeMessage from './WelcomeMessage'; // Import the WelcomeMessage component

const BlurWelcomeMessage = ({ showWelcomeMessage }) => {
  return (
    <>
      {/* Blur effect for the background */}
      {showWelcomeMessage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backdropFilter: 'blur(5px)',
            transition: 'backdrop-filter 0.5s ease', // Smooth transition for blur
            zIndex: 999, // Ensure it's below the welcome message
          }}
        />
      )}
      {/* Welcome message */}
      {showWelcomeMessage && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, pointerEvents: 'none' }}>
          <WelcomeMessage />
        </div>
      )}
    </>
  );
};

export default BlurWelcomeMessage;
import React from 'react';

const WelcomeMessage = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '2rem',
        color: 'white',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        animation: 'fadeOut 3s forwards',
        zIndex: 1000, // Ensure the message is on top
      }}
    >
      Welcome to the Yaswanth Park. press w to start
      <style>
        {`
          @keyframes fadeOut {
            0% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default WelcomeMessage;
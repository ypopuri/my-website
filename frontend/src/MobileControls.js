import React, { useEffect } from 'react';
import nipplejs from 'nipplejs';
import './MobileControls.css'; // Optional: for styling

const MobileControls = ({ onMove }) => {
  useEffect(() => {
    // Create the joystick
    const joystick = nipplejs.create({
      zone: document.getElementById('joystick-zone'), // Zone for the joystick
      mode: 'static', // Static joystick (doesn't follow touch)
      position: { left: '50%', top: '50%' }, // Center the joystick
      color: 'white', // Joystick color
      size: 100, // Size of the joystick
    });

    // Handle joystick movement
    joystick.on('move', (evt, data) => {
      const { x, y } = data.vector; // Get the joystick direction
      onMove(x, y); // Pass the direction to the parent component
    });

    // Handle joystick release
    joystick.on('end', () => {
      onMove(0, 0); // Stop movement when the joystick is released
    });

    // Cleanup on unmount
    return () => {
      joystick.destroy(); // Destroy the joystick when the component unmounts
    };
  }, [onMove]);

  return (
    <div id="joystick-zone" className="joystick-zone">
      {/* Joystick will be rendered here */}
    </div>
  );
};

export default MobileControls;
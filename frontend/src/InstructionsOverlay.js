import React from 'react';
import './InstructionsOverlay.css'; // Optional: for styling

const InstructionsOverlay = () => {
  return (
    <div className="instructions-overlay">
      <p>Press <strong>W</strong> to walk forward</p>
      <p>Press <strong>A</strong> to walk left</p>
      <p>Press <strong>S</strong> to walk backward</p>
      <p>Press <strong>D</strong> to walk right</p>
      <p>Press <strong>ESC</strong> to get the mouse cursor</p>
    </div>
  );
};

export default InstructionsOverlay;
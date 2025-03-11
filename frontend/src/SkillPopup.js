import React, { useState } from 'react';

const SkillPopup = ({ onClose }) => {
  const [selectedYear, setSelectedYear] = useState('2018'); // Default selected year
  const [isAnimating, setIsAnimating] = useState(false); // Track animation state

  // Function to handle year selection
  const handleYearClick = (year) => {
    if (year === selectedYear) return; // Don't animate if the same year is clicked
    setIsAnimating(true); // Start animation
    setTimeout(() => {
      setSelectedYear(year); // Update the selected year
      setIsAnimating(false); // End animation
    }, 300); // Match the duration of the CSS transition
  };

  // Function to get the PDF path based on the selected year
  const getPdfPath = (year) => {
    switch (year) {
      case '2018':
        return '/models/resume/Programming&Development.pdf'; // Updated path
      case '2019-2020':
        return '/models/resume/Cloud&DevOps&Infrastructure.pdf'; // Updated path
      case '2020-2022':
        return '/models/resume/Databases&OperatingSystems.pdf'; // Updated path
      case '2023-2025':
        return '/models/resume/Tools&Testing&Technologies.pdf'; // Updated path
      default:
        return '/models/resume/Programming&Development.pdf'; // Default path
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        {/* Close Button */}
        <button style={styles.closeButton} onClick={onClose}>
          &times; {/* Close icon (X) */}
        </button>

        {/* PDF Viewer */}
        <div style={styles.pdfContainer}>
          <iframe
            src={getPdfPath(selectedYear)}
            style={{
              ...styles.pdfViewer,
              transform: isAnimating ? 'translateX(-100%)' : 'translateX(0)',
              transition: 'transform 0.3s ease-out',
            }}
            title="PDF Viewer"
            width="100%"
            height="100%"
          ></iframe>
        </div>

        {/* Year Selection Buttons */}
        <div style={styles.yearButtons}>
          <button
            style={selectedYear === '2018' ? styles.activeButton : styles.button}
            onClick={() => handleYearClick('2018')}
          >
            Programming & Development
          </button>
          <button
            style={selectedYear === '2019-2020' ? styles.activeButton : styles.button}
            onClick={() => handleYearClick('2019-2020')}
          >
            Cloud, DevOps & Infrastructure
          </button>
          <button
            style={selectedYear === '2020-2022' ? styles.activeButton : styles.button}
            onClick={() => handleYearClick('2020-2022')}
          >
            Databases & Operating Systems
          </button>
          <button
            style={selectedYear === '2023-2025' ? styles.activeButton : styles.button}
            onClick={() => handleYearClick('2023-2025')}
          >
            Tools, Testing & Technologies
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles
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
    width: '80%',
    height: '80%',
    position: 'relative',
    animation: 'fadeIn 0.3s ease-out',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '5px 10px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '50%', // Circular button
    cursor: 'pointer',
    fontSize: '20px', // Larger font size for the close icon
    width: '40px', // Fixed width
    height: '40px', // Fixed height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001, // Ensure it's above other elements
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', // Add a subtle shadow
  },
  pdfContainer: {
    width: '100%',
    height: '80%',
    overflow: 'hidden', // Hide overflowing content
    position: 'relative',
  },
  pdfViewer: {
    width: '100%',
    height: '100%',
    border: 'none',
    marginBottom: '20px',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  yearButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  activeButton: {
    padding: '10px 20px',
    backgroundColor: '#0056b3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default SkillPopup;
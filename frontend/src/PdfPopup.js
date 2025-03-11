import React, { useState, useEffect } from 'react';

const PdfPopup = ({ onClose }) => {
  const [selectedYear, setSelectedYear] = useState('2016-2020'); // Default selected year
  const [isBookOpen, setIsBookOpen] = useState(false); // Track if the book is open
  const [isPageFlipping, setIsPageFlipping] = useState(false); // Track if the page is flipping

  // Map years to PDF files
  const pdfFiles = {
    '2016-2020': '/models/resume/Project_2016-2020.pdf', // Updated path
    '2019': '/models/resume/Project_2019.pdf', // Updated path
    '2020-2022': '/models/resume/project_2020-2022.pdf', // Updated path
    '2023-2025': '/models/resume/Project_2023-2025.pdf', // Updated path
  };

  // Function to handle year selection
  const handleYearClick = (year) => {
    if (!isBookOpen) {
      // Open the book for the first time
      setIsBookOpen(true);
    } else {
      // Trigger page flip animation for subsequent selections
      setIsPageFlipping(true);
      setTimeout(() => {
        setIsPageFlipping(false);
      }, 500); // Match the duration of the page flip animation
    }
    setSelectedYear(year); // Update the selected year
  };

  // Close the popup when the Esc key is pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        {/* Close Button */}
        <button style={styles.closeButton} onClick={onClose}>
          &times; {/* Close icon (X) */}
        </button>

        {/* Book Container */}
        <div style={styles.book}>
          {/* Book Cover */}
          <div
            style={{
              ...styles.cover,
              transform: isBookOpen ? 'rotateY(-180deg)' : 'rotateY(0deg)',
            }}
          >
            <div style={styles.front}>Yaswanth Projects</div>
            <div style={styles.back}></div>
          </div>

          {/* Book Pages */}
          <div
            style={{
              ...styles.pages,
              transform: isPageFlipping ? 'rotateY(-180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.5s ease-out',
            }}
          >
            <div style={styles.page}>
              <iframe
                src={pdfFiles[selectedYear]}
                style={styles.pdf}
                title="PDF Viewer"
                width="100%"
                height="100%"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Year Buttons */}
        <div style={styles.yearButtons}>
          <button
            style={
              selectedYear === '2016-2020' ? styles.activeButton : styles.button
            }
            onClick={() => handleYearClick('2016-2020')}
          >
            2016-2020
          </button>
          <button
            style={
              selectedYear === '2019' ? styles.activeButton : styles.button
            }
            onClick={() => handleYearClick('2019')}
          >
            2019
          </button>
          <button
            style={
              selectedYear === '2020-2022' ? styles.activeButton : styles.button
            }
            onClick={() => handleYearClick('2020-2022')}
          >
            2020-2022
          </button>
          <button
            style={
              selectedYear === '2023-2025' ? styles.activeButton : styles.button
            }
            onClick={() => handleYearClick('2023-2025')}
          >
            2023-2025
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
  book: {
    position: 'relative',
    width: '100%',
    height: '100%',
    perspective: '1000px',
  },
  cover: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    transformStyle: 'preserve-3d',
    transition: 'transform 1s',
    transformOrigin: 'left',
  },
  front: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#ccc',
  },
  back: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    backgroundColor: '#bbb',
    transform: 'rotateY(180deg)',
  },
  pages: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    left: '50%',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.5s ease-out',
    transformOrigin: 'left',
  },
  page: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  yearButtons: {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
  activeButton: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#0056b3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
};

export default PdfPopup;
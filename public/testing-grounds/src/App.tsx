// src/App.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CanvasComponent } from './components/CanvasComponent';
import Toolbar from './components/Toolbar';
import styles from './App.module.css';

function App() {
  // --- State Variables ---
  const [selectedColor, setSelectedColor] = useState('#000000'); 
  const [lineWidth, setLineWidth] = useState(5);
  const [selectedTool, setSelectedTool] = useState('pen'); // 'pen', 'eraser', 'rectangle', 'circle', 'bucket'
  const theme = useState('dark'); // 'dark', 'light'
  const canvasComponentRef = useRef<any>(null); // Ref to access CanvasComponent methods

  // --- Tool Actions (using the ref) ---
  const handleClearCanvas = useCallback(() => {
    if (canvasComponentRef.current) {
      canvasComponentRef.current.clearCanvas();
    }
  }, []); // Empty dependency array as ref doesn't change

  const handleDownloadImage = useCallback(() => {
    if (canvasComponentRef.current) {
      canvasComponentRef.current.downloadImage();
    }
  }, []); // Empty dependency array

  return (
    <div className="appContainer">
      <main className={styles.mainContent}>
        <Toolbar
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          lineWidth={lineWidth}
          setLineWidth={setLineWidth}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          clearCanvas={handleClearCanvas}
          downloadImage={handleDownloadImage}
        />
        <div className={styles.canvasContainer}>
          {/* Pass the ref directly to the forwardRef component */}
          <CanvasComponent
            ref={canvasComponentRef}
            selectedColor={selectedColor}
            lineWidth={lineWidth}
            selectedTool={selectedTool}
            theme={theme}
          />
        </div>
      </main>
    </div>
  );
}

export default App;

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos
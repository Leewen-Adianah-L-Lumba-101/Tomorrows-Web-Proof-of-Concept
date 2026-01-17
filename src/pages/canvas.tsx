// src/App.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CanvasComponent } from '../components/CanvasComponent';
import Toolbar from '../components/Toolbar';
import styles from '../_Canvas.module.scss';
import Navigator from '../components/Header';
import LoadingScreen from '../components/LoadingScreen';

export default function Canvas() {

  // --- State Variables ---
  const [selectedColor, setSelectedColor] = useState('#000000'); 
  const [lineWidth, setLineWidth] = useState(5);
  const [selectedTool, setSelectedTool] = useState('pen'); // 'pen', 'eraser', 'rectangle', 'circle', 'bucket'
  const canvasComponentRef = useRef<any>(null); // Ref to access CanvasComponent methods

  // --- Tool Actions (using the ref) ---
  const handleClearCanvas = useCallback(() => {
    if (canvasComponentRef.current) {
      canvasComponentRef.current.clearCanvas();
    }
  }, []);

  const handleDownloadImage = useCallback(() => {
    if (canvasComponentRef.current) {
      canvasComponentRef.current.downloadImage();
    }
  }, []);

  const [loading, setLoading] = useState(true)

  useEffect(() => {
      setTimeout(() => {
          setLoading(false)
      }, 2000);
  }, []) 
  
  return (
    <div className='bodyCanvas'>
      {/* If loading is set as true, pull up the loading screen */}
      { loading ? (
        <LoadingScreen/>
      ):
        (
          <div className="">
            <Navigator/>
            
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
                  />
                </div>
              </main>
            </div>
          </div>
        )
      }
    </div>
  )
}

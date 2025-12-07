// src/components/Toolbar.jsx
import React from 'react';
import { FaPen, FaEraser, FaPalette, FaTrashAlt, FaDownload, FaSquare, FaCircle, FaFillDrip } from 'react-icons/fa';
import styles from './Toolbar.module.css';

// Create interface to instantiate data types for the props
interface ToolbarProps {
  selectedColor: string; 
  setSelectedColor: (color: string) => void; 
  lineWidth: number;
  setLineWidth: (width: number) => void;
  selectedTool: string;
  setSelectedTool: (tool: string) => void
  clearCanvas: () => void
  downloadImage: () => void
}

// Basic color palette for Toolbar
const colors = [
  '#FFFFFF', '#EF130B', '#FF7100', '#FFE400', '#00CC00',
  '#00B2FF', '#231FD3', '#A300BA', '#FF00FF', '#000000'// Example basic + custom
];

// Pass the ToolbarProps for the functions that modify class attributes
function Toolbar({selectedColor, setSelectedColor, lineWidth, setLineWidth, 
  selectedTool, setSelectedTool, clearCanvas, downloadImage}: ToolbarProps) {
    return (
      <div className={styles.toolbar}>
        {/* Tools Section */}
        <div className={styles.toolSection}>
          <span className={styles.sectionTitle}>Tools</span>
          <button
            title="Pen"
            className={`${styles.toolButton} ${selectedTool === 'pen' ? styles.active : ''}`}
            onClick={() => setSelectedTool('pen')}
          >
            <FaPen />
          </button>
          <button
            title="Eraser"
            className={`${styles.toolButton} ${selectedTool === 'eraser' ? styles.active : ''}`}
            onClick={() => setSelectedTool('eraser')}
          >
            <FaEraser />
          </button>
          {/* Add functional tools */}
          <button
            title="Bucket Fill"
            className={`${styles.toolButton} ${selectedTool === 'bucket' ? styles.active : ''}`}
            onClick={() => setSelectedTool('bucket')}
          ><FaFillDrip /></button>
          <button
            title="Rectangle" /* Title changed */
            className={`${styles.toolButton} ${selectedTool === 'rectangle' ? styles.active : ''}`} /* Tool name changed */
            onClick={() => setSelectedTool('rectangle')}
          ><FaSquare /></button>
          <button
            title="Circle"
            className={`${styles.toolButton} ${selectedTool === 'circle' ? styles.active : ''}`}
            onClick={() => setSelectedTool('circle')}
          ><FaCircle /></button>
        </div>

        {/* Line Width Section */}
        <div className={styles.toolSection}>
          <span className={styles.sectionTitle}>Size</span>
          <input
              type="range"
              title={`Line Width: ${lineWidth}`}
              min="1"
              max="100" // Increased max line width
              step="1"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className={styles.lineWidthSlider}
          />
          <span className={styles.lineWidthValue}>{lineWidth}px</span>
        </div>

        {/* Color Palette Section */}
        <div className={styles.toolSection}>
          <span className={styles.sectionTitle}>Color</span>
          <input
              type="color"
              title="Custom Color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className={styles.colorInput}
          />
          <div className={styles.colorPalette}>
              {colors.map(color => (
                <button
                  key={color}
                  title={color}
                  className={`${styles.colorButton} ${selectedColor.toUpperCase() === color.toUpperCase() ? styles.activeColor : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
          </div>
        </div>

        {/* Canvas Handler Section */}

        <div className={`${styles.toolSection} ${styles.actionsSection}`}>
          
          {/* Removed title span for actions on small screens */}
          <button title="Clear Canvas" className={styles.actionButton} onClick={clearCanvas}>
              <FaTrashAlt /> <span className={styles.buttonText}>CLEAR CANVAS</span>
          </button>
          <button title="Download Image" className={styles.actionButton} onClick={downloadImage}>
              <FaDownload /> <span className={styles.buttonText}>SAVE AS IMAGE</span>
          </button>
        </div>
      </div>
  );
}

export default React.memo(Toolbar);
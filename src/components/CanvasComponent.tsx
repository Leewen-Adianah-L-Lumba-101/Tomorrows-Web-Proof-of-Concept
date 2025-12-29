
import React, { useRef, useEffect, useState, useImperativeHandle, useCallback } from 'react';
import styles from '../_CanvasComponent.module.scss';

// For the custom colour function, converting hex to rgb
function hexToRgba(hex: string) {
 
    let r = 0, g = 0, b = 0, a = 255;

    // Validates the hexcode by removing whitespace
    hex = hex.trim();

    // This changes the hex string into integers (as long as the length is valid)
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16); 
        g = parseInt(hex[2] + hex[2], 16); 
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16); 
        g = parseInt(hex[3] + hex[4], 16); 
        b = parseInt(hex[5] + hex[6], 16);
    } else if (hex.length === 9) {
        r = parseInt(hex[1] + hex[2], 16); 
        g = parseInt(hex[3] + hex[4], 16); 
        b = parseInt(hex[5] + hex[6], 16); 
        a = parseInt(hex[7] + hex[8], 16);
    } else { 
      // If the length of the hex variable is unsuitable, return default black colour
        return [0, 0, 0, 0]; 
    }
    // Returns rgba values as 0 if found null
    return [isNaN(r)?0:r, isNaN(g)?0:g, isNaN(b)?0:b, isNaN(a)?255:a];
}

// Incase of check that prints on console (THIS IS FOR DEBUGGING)
function checkForNull(check: any) {
    if (check === null) {
        console.log("This element is null.")
    } else {
        return(
          console.log("Element is not null.")
        );
    }
}

// Props for influencing Canvas Component
interface CanvasComponentProps {
  selectedColor: string;
  lineWidth: number;
  selectedTool: string;
}

// Props for influencing Canvas Component's overall output (delete/save)
interface CanvasComponentHandle {
  clearCanvas: () => void;
  downloadImage: () => void;
}

// Actual main Canvas Component
// Passing interface props to the forwardRef, allowing the parent element to call methods
export const CanvasComponent = React.forwardRef<CanvasComponentHandle, CanvasComponentProps>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);                      // Check to see if mouse/touch is down 
  const [isManipulatingShape, setIsManipulatingShape] = useState(false);  // Check for active shape drawing
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0});        // Track last position for shape
  const drawingDataRef = useRef<ImageData | null>(null);                  // Stores ImageData for resize restoration
  const shapeStartPosRef = useRef<{ x: number; y: number } | null>(null); // Stores x, y for shape start
  const canvasSnapshotRef = useRef<ImageData | null>(null);               // Stores ImageData before shape preview
  const parentElement = canvasRef.current?.parentElement || null;

  // fill Canvas background function callback
  const fillCanvasBackground = useCallback((context: any, canvas: any, bgColor = null) => {
      const dpr = window.devicePixelRatio || 1;
      const color = bgColor || getComputedStyle(document.documentElement).getPropertyValue('--canvas-background').trim();
      const savedOperation = context.globalCompositeOperation;
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = color;
      // Use canvas size for fillRect when context (website) is scaled
      // This is to make the canvas responsive
      context.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      context.globalCompositeOperation = savedOperation;
  }, []);

  // Using the getCoords from the stable version provided
  const getCoords = useCallback((event: any) => {
     const canvas = canvasRef.current as HTMLCanvasElement | null;
     if (!canvas) return { x: 0, y: 0 };
     
     // Rect returns size of canvas element relative to the viewport
     const rect = canvas.getBoundingClientRect();
     let clientX, clientY;

     if (event.touches && event.touches.length > 0) {
         clientX = event.touches[0].clientX;
         clientY = event.touches[0].clientY;
     } else if (event.clientX !== undefined) {
         clientX = event.clientX;
         clientY = event.clientY;
     } else {
        // Fallback to last known position if event data is missing
        // incase mouse/touch events are funky
        return lastPosition;
     }
     
     // Calculate position relative to the element's bounding box
     return { x: clientX - rect.left, y: clientY - rect.top };
  }, [lastPosition]); // Dependency

  // Draw rectangle function
  const drawRectangle = useCallback((context: any, startX: any, startY: any, endX: any, endY: any) => {
      if (!context) return; 
      context.strokeRect(startX, startY, endX - startX, endY - startY);
  }, []);

  // Draw circle function
  const drawCircle = useCallback((context: any, startX: any, startY: any, endX: any, endY: any) => {
    const radiusX = Math.abs(endX - startX) / 2; 
    const radiusY = Math.abs(endY - startY) / 2;
    const centerX = Math.min(startX, endX) + radiusX; 
    const centerY = Math.min(startY, endY) + radiusY;

    if (radiusX < 0.5 || radiusY < 0.5) return; // Avoid tiny/invalid ellipses
    if (!context) return;
    
    context.beginPath(); 
    context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI); 
    context.stroke();
  }, []);

  // Callbacks for Props/State changes
  const { selectedColor, lineWidth, selectedTool } = props;

  const applyCurrentSettings = useCallback((context: any) => {
    const isEraser = selectedTool === 'eraser';

    context.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    context.strokeStyle = selectedColor; 
    context.fillStyle = selectedColor;
    context.lineWidth = lineWidth; 
    context.lineCap = 'round';
    context.lineJoin = 'round';

  }, [selectedColor, lineWidth, selectedTool]);

  // Callback for fill bucket tool
  const floodFill = useCallback((startX: number, startY: number) => {
    const canvas = canvasRef.current; 
    const context = contextRef.current;
    if (!canvas || !context) return;

    // Backing store size 
    const dpr = window.devicePixelRatio || 1;
    const canvasWidth = canvas.width; 
    const canvasHeight = canvas.height; 

    // Scale logical coordinates to backing-store (pixel) coordinates up front
    const sx = Math.floor(startX * dpr);
    const sy = Math.floor(startY * dpr);

    if (sx < 0 || sx >= canvasWidth || sy < 0 || sy >= canvasHeight) return;

    // Obtain the image data for the whole backing store
    let imageData;
    try { 
      imageData = context.getImageData(0, 0, canvasWidth, canvasHeight); 
    } catch (e) {
      console.log("Flood fill getImageData error:", e); 
      return; 
    }

    const data = imageData.data;
    const pixelIndex = (sy * canvasWidth + sx) * 4;
    const targetColor = [data[pixelIndex], data[pixelIndex + 1], data[pixelIndex + 2], data[pixelIndex + 3]];
    const fillColorRgba = hexToRgba(selectedColor); 
    const fillColor = [fillColorRgba[0], fillColorRgba[1], fillColorRgba[2], fillColorRgba[3]];
    
    // If target and fill colors match, nothing to do
    if (targetColor.every((val, i) => val === fillColor[i])) return;

    const queue: [number, number][] = [[sx, sy]];
    const visited = new Set([`${sx},${sy}`]);
    let iterations = 0;
    const maxIterations = Math.floor(canvasWidth * canvasHeight * 1.5); // Safety limit

    while (queue.length > 0 && iterations < maxIterations) {
      iterations++;
      const next = queue.shift();
      if (!next) continue;

      const [x, y] = next;
      const currentIndex = (y * canvasWidth + x) * 4;

      data[currentIndex]     = fillColor[0];
      data[currentIndex + 1] = fillColor[1];
      data[currentIndex + 2] = fillColor[2];
      data[currentIndex + 3] = fillColor[3];

      [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].forEach(([nx, ny]) => {
        if (nx >= 0 && nx < canvasWidth && ny >= 0 && ny < canvasHeight) {
          const key = `${nx},${ny}`;
          if (!visited.has(key)) {
            const neighborIndex = (ny * canvasWidth + nx) * 4;
            if (data[neighborIndex]     === targetColor[0] &&
                data[neighborIndex + 1] === targetColor[1] &&
                data[neighborIndex + 2] === targetColor[2] &&
                data[neighborIndex + 3] === targetColor[3]) {
                  visited.add(key);
                  queue.push([nx, ny]);
            }
          }
        }
      });
    }

    if (iterations >= maxIterations) console.warn("Flood fill iteration limit reached.");
    context.putImageData(imageData, 0, 0);
    try { drawingDataRef.current = context.getImageData(0, 0, canvasWidth, canvasHeight); }
    catch (e) { console.error("Error saving drawing data after fill:", e); drawingDataRef.current = null; }
  }, [selectedColor]);


  // --- Exposed Methods ---
  const clearCanvas = useCallback(() => {
    const ctx = contextRef.current; const cnv = canvasRef.current;
    if (ctx && cnv) { fillCanvasBackground(ctx, cnv); drawingDataRef.current = null; canvasSnapshotRef.current = null; }
  }, [fillCanvasBackground]);

  // This is a callback when the user attempts to download the canvas image
  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--canvas-background').trim();
    const tempCanvas = document.createElement('canvas'); tempCanvas.width = canvas.width; tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    // If the tempCTx is null, alert the user and then return nothing
    if (!tempCtx) {
      alert("Your image could not be downloaded, try again. Sorry!");
      return;
    }

    tempCtx.fillStyle = bgColor; tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0); try { const dataUrl = tempCanvas.toDataURL('image/png'); const link = document.createElement('a');
    link.href = dataUrl; link.download = 'paint-again-drawing.png'; document.body.appendChild(link); link.click(); document.body.removeChild(link); }
    catch (error) { console.error("Download failed:", error); alert("Could not download image."); }
  }, []);

  useImperativeHandle(ref, () => ({ clearCanvas, downloadImage }), [clearCanvas, downloadImage]);


  // --- Modified Event Handlers ---

  const startDrawing = useCallback((event: any) => {
    // No preventDefault here if attached directly to JSX element (React handles it)
    // However, if using addEventListener, it *is* needed with passive: false
    if (event.button > 0 || !contextRef.current) return; // Ignore right clicks
    const context = contextRef.current;
    const coords = getCoords(event); // Use logical coordinates
    applyCurrentSettings(context);
    setIsDrawing(true);
    setLastPosition(coords); // Store logical coordinates

    if (!canvasRef.current) {
      alert("Could not obtain drawingDataRef, canvasRef is null");
      return;
    }

    if (selectedTool === 'pen' || selectedTool === 'eraser') {
        context.beginPath();
        context.moveTo(coords.x, coords.y); // Start path at logical coordinates
    } else if (selectedTool === 'rectangle' || selectedTool === 'circle') {
        setIsManipulatingShape(true);
        shapeStartPosRef.current = coords; // Store logical start coordinates
        try {
            // Get snapshot based on backing store size
            canvasSnapshotRef.current = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
            
        } catch (e) {
            console.error("Snapshot error:", e);
            canvasSnapshotRef.current = null; setIsManipulatingShape(false); // Abort if snapshot fails
        }
    } else if (selectedTool === 'bucket') {
        floodFill(coords.x, coords.y); // Pass logical coordinates to flood fill
        setIsDrawing(false); // Instant action
    }
  }, [applyCurrentSettings, getCoords, selectedTool, floodFill]); // Dependencies

  // Function for drawing on canvas
  const draw = useCallback((event: any) => {
    if (!isDrawing || !contextRef.current) return;
    const context = contextRef.current;
    // Coordinates of the mouse/touch event
    const coords = getCoords(event); 

    if ((selectedTool === 'pen' || selectedTool === 'eraser') && !isManipulatingShape) {
        context.lineTo(coords.x, coords.y);   // Draw to coordinates
        context.stroke();                     // Draw line
        setLastPosition(coords);              // Update to last known position

    } else if ((selectedTool === 'rectangle' || selectedTool === 'circle') && isManipulatingShape) {
        if (!canvasSnapshotRef.current || !shapeStartPosRef.current) return;
        context.putImageData(canvasSnapshotRef.current, 0, 0);  // Restore previously saved canvas data
        applyCurrentSettings(context);                          // Re-apply settings for shape preview
        // Draw shape preview using last known coordinates
        if (selectedTool === 'rectangle') {
            drawRectangle(context, shapeStartPosRef.current.x, shapeStartPosRef.current.y, coords.x, coords.y);
        } else if (selectedTool === 'circle') {
            drawCircle(context, shapeStartPosRef.current.x, shapeStartPosRef.current.y, coords.x, coords.y);
        }
        setLastPosition(coords);                                // Update last position for stopDrawing
    }
  }, [isDrawing, isManipulatingShape, getCoords, selectedTool, drawRectangle, drawCircle, applyCurrentSettings]); // Dependencies

  const stopDrawing = useCallback(() => {
    // No event needed if attached directly to TSX element
    if (!isDrawing || !contextRef.current) return;
    const context = contextRef.current;

    if (isManipulatingShape && (selectedTool === 'rectangle' || selectedTool === 'circle')) {
        if (canvasSnapshotRef.current && shapeStartPosRef.current) {
             context.putImageData(canvasSnapshotRef.current, 0, 0); // Restore before final draw
             const endCoords = lastPosition; // Use the last position state
             applyCurrentSettings(context);
             // Draw final shape using logical coordinates
             if (selectedTool === 'rectangle') {
                 drawRectangle(context, shapeStartPosRef.current.x, shapeStartPosRef.current.y, endCoords.x, endCoords.y);
             } else if (selectedTool === 'circle') {
                 drawCircle(context, shapeStartPosRef.current.x, shapeStartPosRef.current.y, endCoords.x, endCoords.y);
             }
        }
    }

    // Reset shape state/refs AFTER potential final draw
    canvasSnapshotRef.current = null;
    shapeStartPosRef.current = null;
    setIsManipulatingShape(false);
    setIsDrawing(false); // Mouse/touch is up

    if (!canvasRef.current) {
      checkForNull(!canvasRef.current);
      return;
    }

    // Save final canvas state using backing store size
    try {
       drawingDataRef.current = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    } catch(e) {
        console.error("Error saving final drawing data:", e);
        drawingDataRef.current = null;
    }
  }, [isDrawing, isManipulatingShape, selectedTool, drawRectangle, drawCircle, applyCurrentSettings, lastPosition]); // Dependencies


  // Effect for ONE-TIME Setup and Resize Handling
  useEffect(() => {
    const canvas : HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;

    // Get context from canvas element
    const context = canvas.getContext('2d', { 
        willReadFrequently: true 
    });

    contextRef.current = context;
    let animationFrameId : number | null = null;

    const setCanvasDimensions = (initialSetup = false) => {
        if (!canvas.parentElement) return;
        if (!context) return;
        const dpr = window.devicePixelRatio || 1;
        // Use parent size from getBoundingClientRect as in your stable version
        const { width, height } = canvas.parentElement.getBoundingClientRect();
        const displayWidth = Math.floor(width);
        const displayHeight = Math.floor(height);
        const backingStoreWidth = Math.floor(width * dpr);
        const backingStoreHeight = Math.floor(height * dpr);

        // Check if resize is actually needed (same check as your stable version)
        if (!initialSetup && canvas.width === backingStoreWidth && canvas.height === backingStoreHeight) {
            return;
        }
        
        // Use ref, same as your stable version
        const savedDrawing = drawingDataRef.current; 

        // Set attributes AND style width/height, as in your stable version
        canvas.width = backingStoreWidth;
        canvas.height = backingStoreHeight;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        // Reset transform and scale fresh each time for clarity
        // const context: any = context.resetTransform();
        context.resetTransform();
        context.scale(dpr, dpr);

        // Fill background AFTER scaling
        fillCanvasBackground(context, canvas);

        // Restore the drawing if it exists (existing lines are saved to canvas)
        if (savedDrawing) {
          try {
            const srcW = savedDrawing.width;
            const srcH = savedDrawing.height;
            const dstW = canvas.width;
            const dstH = canvas.height;

            const savedW = Math.min(srcW, dstW);
            const savedH = Math.min(srcH, dstH);

            if (savedW > 0 && savedH > 0) {
              // Create a new ImageData for the intersection region and copy rows
              const copied = new ImageData(savedW, savedH);

              // Returns the lines as a imagedataarray
              const srcData = savedDrawing.data;
              const dstData = copied.data;

              // Redraws the lines by pixed row by row
              for (let row = 0; row < savedH; row++) {
                const srcStart = row * srcW * 4;
                const dstStart = row * savedW * 4;
                dstData.set(srcData.subarray(srcStart, srcStart + savedW * 4), dstStart);
              }

              // putImageData writes directly to the backing store (ignores transforms)
              context.putImageData(copied, 0, 0);
            }
            // If the new canvas is larger than the saved drawing, the extra area
            // remains filled by fillCanvasBackground above (so we don't stretch).
          } catch (e) {
            console.error("Restore error:", e);
            drawingDataRef.current = null;
          }
        }

        // Apply current tool settings (same as your stable version)
        applyCurrentSettings(context);
    };

    // Initial setup call
    setCanvasDimensions(true);


    // Observe parent element, as in your stable version
    const resizeObserver = new ResizeObserver(() => {
        if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
        animationFrameId = window.requestAnimationFrame(() => setCanvasDimensions(false));
    });
    if (parentElement) { resizeObserver.observe(parentElement); }

    // Cleanup function (same as your stable version)
    return () => {
       if (parentElement) resizeObserver.unobserve(parentElement);
       if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
    // Dependencies should match your stable version or be minimal
  }, [applyCurrentSettings, fillCanvasBackground]); // Stick to stable dependencies


  // Effect to apply settings when props change
  useEffect(() => {
    // if context exists and not currently drawing a shape preview
    if (contextRef.current && !isManipulatingShape) {
        applyCurrentSettings(contextRef.current);
    }
    // Rerun the default settings anyway
  }, [selectedColor, lineWidth, selectedTool, applyCurrentSettings, isManipulatingShape]);

  // Actual TSX component return
  return (
    <canvas ref={canvasRef} className={styles.paintCanvas}
    
      // Stop drawing if mouse leaves canvas
      onMouseDown={startDrawing} onMouseMove={draw}
      onMouseUp={stopDrawing} onMouseLeave={stopDrawing} 

      // Touch events to trigger passive listener warnings/errors
      onTouchStart={startDrawing} onTouchMove={draw}
      onTouchEnd={stopDrawing} onTouchCancel={stopDrawing} // Handle interruptions
    />
  );
});
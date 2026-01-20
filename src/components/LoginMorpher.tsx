import React, { useEffect, useCallback, useRef } from "react";
import _, { List } from "lodash";
import { useState } from "react";
import styles from '../_canvas.module.scss';

export default function LoginMorpher() {
  const [selectedColor, setSelectedColor] = useState('#B88B4A'); 
  const [lineWidth, setLineWidth] = useState(10);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0});
  const drawingDataRef = useRef<ImageData | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pathsRef = useRef<Array<{
    points: Array<{ x: number; y: number }>; color: string; width: number 
  }>>([]); 

  // Most of these are duplicates of the existing CanvasComponent file
  // But its modified to specifically have animated squiggle lines for register's page

  // Fill the canvas background with the og color
  const fillCanvasBackground = useCallback((context: any, canvas: any, bgColor = null) => {
    const dpr = window.devicePixelRatio || 1;
    const color = bgColor || getComputedStyle(document.documentElement).getPropertyValue('--canvas-background').trim();
    const savedOperation = context.globalCompositeOperation;
    context.globalCompositeOperation = 'source-over';
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    context.globalCompositeOperation = savedOperation;
  }, []);

  // Obtain coords from mouse or touch events
  const getCoords = useCallback((event: any) => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if (event.touches && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if (event.clientX !== undefined) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      clientX = 0;
      clientY = 0;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  // Apply the current settings to the canvas contesxt
  const applyCurrentSettings = useCallback((context: any) => {
    context.globalCompositeOperation = 'source-over';
    context.strokeStyle = selectedColor; 
    context.fillStyle = selectedColor;
    context.lineWidth = lineWidth; 
    context.lineCap = 'round';
    context.lineJoin = 'round';
  }, [selectedColor, lineWidth]);

  // ANIMATE SGUIGSS
  const drawAnimatedPaths = useCallback(() => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (!context || !canvas) return;
    fillCanvasBackground(context, canvas);
    const time = Date.now() * 0.003;
    pathsRef.current.forEach(path => {
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = path.color;
      context.lineWidth = path.width;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.beginPath();
      path.points.forEach((point, index) => {
        const squiggleX = Math.sin(time + index * 0.1) * 2;
        const squiggleY = Math.cos(time + index * 0.1) * 2;
        const x = point.x + squiggleX;
        const y = point.y + squiggleY;
        if (index === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      });
      context.stroke();
    });
    context.globalCompositeOperation = 'source-over';
    animationFrameRef.current = requestAnimationFrame(drawAnimatedPaths);
  }, [fillCanvasBackground]);

  // Start the animation
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(drawAnimatedPaths);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawAnimatedPaths]);

  const startDrawing = useCallback((event: any) => {
    if (event.button > 0 || !contextRef.current) return;
    const coords = getCoords(event);
    setIsDrawing(true);
    setLastPosition(coords);
    pathsRef.current.push({
      points: [coords],
      color: selectedColor,
      width: lineWidth
    });
  }, [getCoords, selectedColor, lineWidth]);

  const draw = useCallback((event: any) => {
    if (!isDrawing) return;
    const coords = getCoords(event);
    const currentPath = pathsRef.current[pathsRef.current.length - 1];
    if (currentPath) {
      currentPath.points.push(coords);
    }
    setLastPosition(coords);
  }, [isDrawing, getCoords]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current && contextRef.current) {
      try {
        drawingDataRef.current = contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      } catch(e) {
        console.error("Error saving final drawing data:", e);
        drawingDataRef.current = null;
      }
    }
  }, [isDrawing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    contextRef.current = context;
    const dpr = window.devicePixelRatio || 1;

    // Set to fit parent
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    // After setting style, get the actual size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    context.scale(dpr, dpr);
    fillCanvasBackground(context, canvas);
  }, [fillCanvasBackground]);

  // If the current settings change, re-apply them
  useEffect(() => {
    if (contextRef.current) {
      applyCurrentSettings(contextRef.current);
    }
  }, [selectedColor, lineWidth, applyCurrentSettings]);

  return (
    <div className="canvas-register">
      <canvas ref={canvasRef} className={styles.paintCanvas}
        onMouseDown={startDrawing} onMouseMove={draw}
        onMouseUp={stopDrawing} onMouseLeave={stopDrawing} 
        onTouchStart={startDrawing} onTouchMove={draw}
        onTouchEnd={stopDrawing} onTouchCancel={stopDrawing}
        />
    </div>
  );
}

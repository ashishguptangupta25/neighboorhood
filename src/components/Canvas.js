import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

function Canvas({ elements, setElements, selectedElement, setSelectedElement }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f8f9fa',
    });

    canvas.on('object:selected', (e) => {
      setSelectedElement(e.target);
    });

    canvas.on('selection:cleared', () => {
      setSelectedElement(null);
    });

    elements.forEach((element) => {
      if (element.type === 'building') {
        const rect = new fabric.Rect({
          left: element.x,
          top: element.y,
          fill: element.color || 'gray',
          width: element.width || 40,
          height: element.height || 40,
        });
        canvas.add(rect);
      } else if (element.type === 'road') {
        const line = new fabric.Line(element.points, {
          stroke: element.color || 'black',
          strokeWidth: element.width || 5,
        });
        canvas.add(line);
      } else if (element.type === 'business') {
        const circle = new fabric.Circle({
          left: element.x,
          top: element.y,
          radius: 20,
          fill: element.color || 'orange',
        });
        canvas.add(circle);
      }
    });

    return () => canvas.dispose();
  }, [elements]);

  return <canvas ref={canvasRef}></canvas>;
}

export default Canvas;
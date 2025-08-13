import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import LayoutElement from './LayoutElement';

function Canvas({ elements, setElements, selectedElement, setSelectedElement }) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });

  // Initialize fabric canvas
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasDimensions.width,
      height: canvasDimensions.height,
      backgroundColor: '#f8f9fa',
      selection: false, // Disable group selection for now
    });

    fabricCanvasRef.current = canvas;

    // Handle canvas clicks (for deselecting elements)
    canvas.on('mouse:down', (options) => {
      if (!options.target) {
        setSelectedElement(null);
      }
    });

    // Handle object modification
    canvas.on('object:modified', (e) => {
      const obj = e.target;
      const elementId = obj.elementId;
      
      if (elementId) {
        setElements(prev => prev.map(el => 
          el.id === elementId ? {
            ...el,
            x: Math.round(obj.left),
            y: Math.round(obj.top),
            width: Math.round(obj.width * obj.scaleX),
            height: Math.round(obj.height * obj.scaleY),
          } : el
        ));
      }
    });

    // Handle selection
    canvas.on('selection:created', (e) => {
      const obj = e.selected[0];
      if (obj && obj.elementId) {
        const element = elements.find(el => el.id === obj.elementId);
        if (element) {
          setSelectedElement(element);
        }
      }
    });

    canvas.on('selection:updated', (e) => {
      const obj = e.selected[0];
      if (obj && obj.elementId) {
        const element = elements.find(el => el.id === obj.elementId);
        if (element) {
          setSelectedElement(element);
        }
      }
    });

    canvas.on('selection:cleared', () => {
      setSelectedElement(null);
    });

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  // Update fabric objects when elements change
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.clear();

    elements.forEach((element) => {
      let fabricObject;

      if (element.type === 'building') {
        fabricObject = new fabric.Rect({
          left: element.x,
          top: element.y,
          fill: element.color || '#888888',
          width: element.width || 50,
          height: element.height || 50,
          elementId: element.id,
        });
      } else if (element.type === 'road') {
        const points = element.points || [element.x, element.y, element.x + (element.width || 100), element.y];
        fabricObject = new fabric.Line(points, {
          stroke: element.color || '#333333',
          strokeWidth: element.height || element.width || 5,
          elementId: element.id,
        });
      } else if (element.type === 'business') {
        fabricObject = new fabric.Circle({
          left: element.x,
          top: element.y,
          radius: Math.min(element.width || 25, element.height || 25) / 2,
          fill: element.color || '#FF8C00',
          elementId: element.id,
        });
      }

      if (fabricObject) {
        canvas.add(fabricObject);
      }
    });

    canvas.renderAll();
  }, [elements]);

  // Handle responsive canvas sizing
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const maxWidth = Math.min(container.clientWidth - 20, 800);
        const maxHeight = Math.min(container.clientHeight - 20, 600);
        setCanvasDimensions({ width: maxWidth, height: maxHeight });
        
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.setDimensions({ width: maxWidth, height: maxHeight });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  const handleElementDoubleClick = (element) => {
    // Focus on properties panel for editing
    const propertiesPanel = document.querySelector('.properties-panel input');
    if (propertiesPanel) {
      propertiesPanel.focus();
    }
  };

  return (
    <div className="canvas-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ border: '1px solid #ddd' }}></canvas>
      {/* Overlay React components for better integration */}
      <div className="elements-overlay" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        {elements.map((element) => (
          <div key={element.id} style={{ pointerEvents: 'all' }}>
            <LayoutElement
              element={element}
              isSelected={selectedElement?.id === element.id}
              onClick={() => handleElementClick(element)}
              onDoubleClick={() => handleElementDoubleClick(element)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

Canvas.propTypes = {
  elements: PropTypes.array.isRequired,
  setElements: PropTypes.func.isRequired,
  selectedElement: PropTypes.object,
  setSelectedElement: PropTypes.func.isRequired,
};

export default Canvas;
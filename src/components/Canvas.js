import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import Building from './Building';
import Road from './Road';
import BusinessMarker from './BusinessMarker';

function Canvas({ elements, setElements, selectedElement, setSelectedElement }) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [draggedElement, setDraggedElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!fabricCanvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#f8f9fa',
        selection: false
      });

      fabricCanvasRef.current = canvas;

      // Handle fabric object modifications
      canvas.on('object:modified', (e) => {
        const obj = e.target;
        if (obj.elementId) {
          updateElementFromFabricObject(obj);
        }
      });

      canvas.on('object:moving', (e) => {
        const obj = e.target;
        if (obj.elementId) {
          updateElementFromFabricObject(obj);
        }
      });

      canvas.on('object:selected', (e) => {
        const obj = e.target;
        if (obj.elementId) {
          const element = elements.find(el => el.id === obj.elementId);
          setSelectedElement(element);
        }
      });

      canvas.on('selection:cleared', () => {
        setSelectedElement(null);
      });
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  // Update fabric objects when elements change
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    canvas.clear();

    elements.forEach((element) => {
      let fabricObj;
      
      if (element.type === 'building') {
        fabricObj = new fabric.Rect({
          left: element.x,
          top: element.y,
          fill: element.color || '#8B4513',
          width: element.width || 60,
          height: element.height || 60,
          elementId: element.id,
          hasControls: true,
          hasBorders: true
        });
      } else if (element.type === 'road') {
        const points = element.points || [0, 0, 100, 0];
        fabricObj = new fabric.Line(points, {
          stroke: element.color || '#404040',
          strokeWidth: element.width || 5,
          elementId: element.id,
          hasControls: true,
          hasBorders: true
        });
      } else if (element.type === 'business') {
        fabricObj = new fabric.Circle({
          left: element.x,
          top: element.y,
          radius: (element.width || 40) / 2,
          fill: element.color || '#FF6B35',
          elementId: element.id,
          hasControls: true,
          hasBorders: true
        });
      }

      if (fabricObj) {
        canvas.add(fabricObj);
      }
    });

    canvas.renderAll();
  }, [elements]);

  const updateElementFromFabricObject = (obj) => {
    const elementId = obj.elementId;
    if (!elementId) return;

    setElements(prevElements => 
      prevElements.map(element => {
        if (element.id === elementId) {
          if (element.type === 'building') {
            return {
              ...element,
              x: Math.round(obj.left),
              y: Math.round(obj.top),
              width: Math.round(obj.width * obj.scaleX),
              height: Math.round(obj.height * obj.scaleY)
            };
          } else if (element.type === 'business') {
            return {
              ...element,
              x: Math.round(obj.left),
              y: Math.round(obj.top),
              width: Math.round(obj.radius * 2 * obj.scaleX),
              height: Math.round(obj.radius * 2 * obj.scaleY)
            };
          } else if (element.type === 'road') {
            return {
              ...element,
              points: [obj.x1, obj.y1, obj.x2, obj.y2],
              width: Math.round(obj.strokeWidth)
            };
          }
        }
        return element;
      })
    );
  };

  const handleElementClick = (element) => {
    setSelectedElement(selectedElement?.id === element.id ? null : element);
    
    // Select corresponding fabric object
    if (fabricCanvasRef.current) {
      const fabricObj = fabricCanvasRef.current.getObjects().find(obj => obj.elementId === element.id);
      if (fabricObj) {
        fabricCanvasRef.current.setActiveObject(fabricObj);
        fabricCanvasRef.current.renderAll();
      }
    }
  };

  const handleMouseDown = (e, element) => {
    if (e.button === 0) { // Left click
      const rect = e.currentTarget.getBoundingClientRect();
      setDraggedElement(element);
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (draggedElement) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - dragOffset.x;
      const newY = e.clientY - canvasRect.top - dragOffset.y;

      setElements(prevElements =>
        prevElements.map(element =>
          element.id === draggedElement.id
            ? { ...element, x: Math.max(0, Math.min(newX, 800 - (element.width || 40))) }
            : element
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const canvasStyles = {
    position: 'relative',
    border: '2px solid #ddd',
    margin: '10px auto',
    display: 'block',
    cursor: draggedElement ? 'grabbing' : 'default'
  };

  const overlayStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 10
  };

  return (
    <div 
      style={canvasStyles}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas ref={canvasRef} />
      <div style={overlayStyles}>
        {elements.map((element) => {
          const isSelected = selectedElement?.id === element.id;
          
          if (element.type === 'building') {
            return (
              <Building
                key={element.id}
                element={element}
                isSelected={isSelected}
                onClick={() => handleElementClick(element)}
                onMouseDown={(e) => handleMouseDown(e, element)}
              />
            );
          } else if (element.type === 'road') {
            return (
              <Road
                key={element.id}
                element={element}
                isSelected={isSelected}
                onClick={() => handleElementClick(element)}
              />
            );
          } else if (element.type === 'business') {
            return (
              <BusinessMarker
                key={element.id}
                element={element}
                isSelected={isSelected}
                onClick={() => handleElementClick(element)}
                onMouseDown={(e) => handleMouseDown(e, element)}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

Canvas.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.oneOf(['building', 'road', 'business']).isRequired,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string
  })).isRequired,
  setElements: PropTypes.func.isRequired,
  selectedElement: PropTypes.object,
  setSelectedElement: PropTypes.func.isRequired
};

export default Canvas;
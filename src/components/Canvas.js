import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import { fabricToElement } from '../utils/elementStructure';

function Canvas({ elements, setElements, selectedElement, setSelectedElement, selectedTool, addElement, updateElement }) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const elementToFabricMap = useRef(new Map());
  const elementsRef = useRef(elements);
  const selectedToolRef = useRef(selectedTool);
  const addElementRef = useRef(addElement);
  const updateElementRef = useRef(updateElement);
  const setSelectedElementRef = useRef(setSelectedElement);

  // Update refs when props change
  useEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  useEffect(() => {
    selectedToolRef.current = selectedTool;
  }, [selectedTool]);

  useEffect(() => {
    addElementRef.current = addElement;
  }, [addElement]);

  useEffect(() => {
    updateElementRef.current = updateElement;
  }, [updateElement]);

  useEffect(() => {
    setSelectedElementRef.current = setSelectedElement;
  }, [setSelectedElement]);

  // Initialize fabric canvas
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f8f9fa',
    });

    fabricCanvasRef.current = canvas;
    
    // Store fabric canvas reference on DOM element for debugging
    canvasRef.current.fabric = canvas;

    // Handle object selection
    canvas.on('selection:created', (e) => {
      console.log('Selection created:', e.selected[0]);
      const fabricObject = e.selected[0];
      const elementId = fabricObject.elementId;
      const element = elementsRef.current.find(el => el.id === elementId);
      console.log('Found element:', element);
      if (element) {
        setSelectedElementRef.current(element);
      }
    });

    canvas.on('selection:updated', (e) => {
      console.log('Selection updated:', e.selected[0]);
      const fabricObject = e.selected[0];
      const elementId = fabricObject.elementId;
      const element = elementsRef.current.find(el => el.id === elementId);
      if (element) {
        setSelectedElementRef.current(element);
      }
    });

    canvas.on('selection:cleared', () => {
      console.log('Selection cleared');
      setSelectedElementRef.current(null);
    });

    // Handle object modifications (move, resize, etc.)
    canvas.on('object:modified', (e) => {
      const fabricObject = e.target;
      const elementId = fabricObject.elementId;
      const originalElement = elementsRef.current.find(el => el.id === elementId);
      
      if (originalElement) {
        const updatedElement = fabricToElement(fabricObject, originalElement);
        updateElementRef.current(elementId, updatedElement);
      }
    });

    // Handle canvas clicks for adding elements
    canvas.on('mouse:down', (e) => {
      if (selectedToolRef.current !== 'select' && !e.target) {
        const pointer = canvas.getPointer(e.e);
        addElementRef.current(selectedToolRef.current, { x: pointer.x, y: pointer.y });
      }
    });

    return () => {
      canvas.dispose();
    };
  }, []); // Empty dependency array since we use refs

  // Sync elements with fabric canvas
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Get current fabric objects
    const currentObjects = canvas.getObjects();
    const currentElementIds = new Set(currentObjects.map(obj => obj.elementId));
    const newElementIds = new Set(elements.map(el => el.id));

    // Remove objects that no longer exist in elements
    currentObjects.forEach(obj => {
      if (!newElementIds.has(obj.elementId)) {
        canvas.remove(obj);
        elementToFabricMap.current.delete(obj.elementId);
      }
    });

    // Add or update elements
    elements.forEach((element) => {
      const existingObject = elementToFabricMap.current.get(element.id);
      
      if (existingObject) {
        // Update existing object properties
        const updates = {};
        
        if (element.type === 'building') {
          updates.left = element.x;
          updates.top = element.y;
          updates.fill = element.color;
          updates.width = element.width;
          updates.height = element.height;
        } else if (element.type === 'road') {
          const points = element.points || [element.x, element.y, element.x + 100, element.y];
          updates.x1 = points[0];
          updates.y1 = points[1];
          updates.x2 = points[2];
          updates.y2 = points[3];
          updates.stroke = element.color;
          updates.strokeWidth = element.width || 5;
        } else if (element.type === 'business') {
          updates.left = element.x;
          updates.top = element.y;
          updates.radius = element.radius || 20;
          updates.fill = element.color;
        }
        
        // Apply updates and re-render
        existingObject.set(updates);
        existingObject.setCoords();
        canvas.renderAll();
        
      } else if (!currentElementIds.has(element.id)) {
        // Add new object
        let fabricObject;

        if (element.type === 'building') {
          fabricObject = new fabric.Rect({
            left: element.x,
            top: element.y,
            fill: element.color,
            width: element.width,
            height: element.height,
            selectable: true,
            elementId: element.id,
          });
        } else if (element.type === 'road') {
          const points = element.points || [element.x, element.y, element.x + 100, element.y];
          fabricObject = new fabric.Line(points, {
            stroke: element.color,
            strokeWidth: element.width || 5,
            selectable: true,
            elementId: element.id,
          });
        } else if (element.type === 'business') {
          fabricObject = new fabric.Circle({
            left: element.x,
            top: element.y,
            radius: element.radius || 20,
            fill: element.color,
            selectable: true,
            elementId: element.id,
          });
        }

        if (fabricObject) {
          canvas.add(fabricObject);
          elementToFabricMap.current.set(element.id, fabricObject);
        }
      }
    });

    canvas.renderAll();
  }, [elements]);

  // Handle element deletion with keyboard
  const handleKeyDown = useCallback((e) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement) {
      e.preventDefault();
      const canvas = fabricCanvasRef.current;
      const fabricObject = elementToFabricMap.current.get(selectedElement.id);
      if (fabricObject) {
        canvas.remove(fabricObject);
        canvas.renderAll();
      }
      // Remove from elements array
      updateElementRef.current(selectedElement.id, null);
    }
  }, [selectedElement]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      // Make canvas focusable for keyboard events
      const canvasElement = canvas.getElement();
      canvasElement.setAttribute('tabindex', '0');
      canvasElement.addEventListener('keydown', handleKeyDown);
      
      return () => {
        canvasElement.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown]);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} tabIndex="0" style={{outline: 'none'}}></canvas>
      <div className="canvas-instructions">
        <small>Click elements to select • Use Delete key to remove • Drag to move • Drag corners to resize</small>
      </div>
    </div>
  );
}

Canvas.propTypes = {
  elements: PropTypes.array.isRequired,
  setElements: PropTypes.func.isRequired,
  selectedElement: PropTypes.object,
  setSelectedElement: PropTypes.func.isRequired,
  selectedTool: PropTypes.string.isRequired,
  addElement: PropTypes.func.isRequired,
  updateElement: PropTypes.func.isRequired,
};

export default Canvas;
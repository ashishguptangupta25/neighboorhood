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

    // Clear canvas
    canvas.clear();
    elementToFabricMap.current.clear();

    // Add all elements to canvas
    elements.forEach((element) => {
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
    });

    canvas.renderAll();
  }, [elements]);

  // Handle element deletion
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Delete' && selectedElement) {
      const canvas = fabricCanvasRef.current;
      const fabricObject = elementToFabricMap.current.get(selectedElement.id);
      if (fabricObject) {
        canvas.remove(fabricObject);
      }
      // Remove from elements array
      updateElement(selectedElement.id, null);
    }
  }, [selectedElement, updateElement]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} tabIndex="0"></canvas>
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
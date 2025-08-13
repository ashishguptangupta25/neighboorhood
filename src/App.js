import React, { useState, useEffect, useCallback } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import ExportImport from './components/ExportImport';
import PropertiesPanel from './components/PropertiesPanel';
import { loadLayoutFromLocalStorage, saveLayoutToLocalStorage } from './utils/localStorageManager';
import { createElement } from './utils/elementStructure';

function App() {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedTool, setSelectedTool] = useState('select');

  useEffect(() => {
    const savedLayout = loadLayoutFromLocalStorage();
    if (savedLayout) setElements(savedLayout);
  }, []);

  useEffect(() => {
    saveLayoutToLocalStorage(elements);
  }, [elements]);

  // Handler for adding new elements from toolbar
  const addElement = useCallback((type, position = { x: 100, y: 100 }) => {
    const newElement = createElement(type, position);
    setElements(prev => [...prev, newElement]);
    return newElement;
  }, []);

  // Handler for removing elements
  const removeElement = useCallback((elementId) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElement && selectedElement.id === elementId) {
      setSelectedElement(null);
    }
  }, [selectedElement]);

  // Handler for updating element properties
  const updateElement = useCallback((elementId, updates) => {
    if (updates === null) {
      // Remove element
      removeElement(elementId);
    } else {
      setElements(prev => 
        prev.map(el => el.id === elementId ? { ...el, ...updates } : el)
      );
    }
  }, [removeElement]);

  return (
    <div className="app">
      <Toolbar 
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        addElement={addElement}
      />
      <Canvas
        elements={elements}
        setElements={setElements}
        selectedElement={selectedElement}
        setSelectedElement={setSelectedElement}
        selectedTool={selectedTool}
        addElement={addElement}
        updateElement={updateElement}
      />
      <PropertiesPanel
        selectedElement={selectedElement}
        updateElement={updateElement}
        elements={elements}
      />
      <ExportImport 
        elements={elements}
        setElements={setElements} 
      />
    </div>
  );
}

export default App;
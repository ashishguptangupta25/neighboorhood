import React, { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import ExportImport from './components/ExportImport';
import PropertiesPanel from './components/PropertiesPanel';
import { loadLayoutFromLocalStorage, saveLayoutToLocalStorage } from './utils/localStorageManager';

function App() {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

  // Load layout from localStorage on mount
  useEffect(() => {
    const savedLayout = loadLayoutFromLocalStorage();
    if (savedLayout && Array.isArray(savedLayout)) {
      setElements(savedLayout);
    }
  }, []);

  // Save layout to localStorage whenever elements change
  useEffect(() => {
    saveLayoutToLocalStorage(elements);
  }, [elements]);

  // Clear selection when element is deleted
  useEffect(() => {
    if (selectedElement && !elements.find(el => el.id === selectedElement.id)) {
      setSelectedElement(null);
    }
  }, [elements, selectedElement]);

  return (
    <div className="app">
      <Toolbar setElements={setElements} />
      <Canvas
        elements={elements}
        setElements={setElements}
        selectedElement={selectedElement}
        setSelectedElement={setSelectedElement}
      />
      <PropertiesPanel
        selectedElement={selectedElement}
        setElements={setElements}
        elements={elements}
      />
      <ExportImport elements={elements} setElements={setElements} />
    </div>
  );
}

export default App;
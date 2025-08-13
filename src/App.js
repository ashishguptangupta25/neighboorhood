import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import ExportImport from './components/ExportImport';
import PropertiesPanel from './components/PropertiesPanel';
import { loadLayoutFromLocalStorage, saveLayoutToLocalStorage } from './utils/localStorageManager';

function App() {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

  useEffect(() => {
    const savedLayout = loadLayoutFromLocalStorage();
    if (savedLayout) setElements(savedLayout);
  }, []);

  useEffect(() => {
    saveLayoutToLocalStorage(elements);
  }, [elements]);

  return (
    <div className="app">
      <Toolbar elements={elements} setElements={setElements} />
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
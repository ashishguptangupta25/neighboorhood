import React from 'react';

function PropertiesPanel({ selectedElement, elements, setElements }) {
  const handlePropertyChange = (key, value) => {
    const updatedElements = elements.map((el) =>
      el.id === selectedElement.id ? { ...el, [key]: value } : el
    );
    setElements(updatedElements);
  };

  if (!selectedElement) {
    return <div className="properties-panel">Select an element to edit its properties</div>;
  }

  return (
    <div className="properties-panel">
      <h3>Edit Properties</h3>
      <label>
        Name:
        <input
          type="text"
          value={selectedElement.name || ''}
          onChange={(e) => handlePropertyChange('name', e.target.value)}
        />
      </label>
      <label>
        Color:
        <input
          type="color"
          value={selectedElement.color || '#000000'}
          onChange={(e) => handlePropertyChange('color', e.target.value)}
        />
      </label>
      <label>
        Width:
        <input
          type="number"
          value={selectedElement.width || 0}
          onChange={(e) => handlePropertyChange('width', parseInt(e.target.value, 10))}
        />
      </label>
      <label>
        Height:
        <input
          type="number"
          value={selectedElement.height || 0}
          onChange={(e) => handlePropertyChange('height', parseInt(e.target.value, 10))}
        />
      </label>
    </div>
  );
}

export default PropertiesPanel;
import React from 'react';
import PropTypes from 'prop-types';

function PropertiesPanel({ selectedElement, elements, setElements }) {
  const handlePropertyChange = (key, value) => {
    if (!selectedElement) return;
    
    const updatedElements = elements.map((el) =>
      el.id === selectedElement.id ? { ...el, [key]: value } : el
    );
    setElements(updatedElements);
  };

  const handleDelete = () => {
    if (!selectedElement) return;
    
    const updatedElements = elements.filter((el) => el.id !== selectedElement.id);
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
        Description:
        <textarea
          value={selectedElement.description || ''}
          onChange={(e) => handlePropertyChange('description', e.target.value)}
          rows="3"
        />
      </label>
      <label>
        Type:
        <select
          value={selectedElement.type || 'building'}
          onChange={(e) => handlePropertyChange('type', e.target.value)}
        >
          <option value="building">Building</option>
          <option value="road">Road</option>
          <option value="business">Business</option>
        </select>
      </label>
      <label>
        Color:
        <input
          type="color"
          value={selectedElement.color || '#000000'}
          onChange={(e) => handlePropertyChange('color', e.target.value)}
        />
      </label>
      {selectedElement.type !== 'road' && (
        <>
          <label>
            Width:
            <input
              type="number"
              value={selectedElement.width || 0}
              onChange={(e) => handlePropertyChange('width', parseInt(e.target.value, 10))}
              min="1"
            />
          </label>
          <label>
            Height:
            <input
              type="number"
              value={selectedElement.height || 0}
              onChange={(e) => handlePropertyChange('height', parseInt(e.target.value, 10))}
              min="1"
            />
          </label>
        </>
      )}
      <button onClick={handleDelete} className="delete-button">
        Delete Element
      </button>
    </div>
  );
}

PropertiesPanel.propTypes = {
  selectedElement: PropTypes.object,
  elements: PropTypes.array.isRequired,
  setElements: PropTypes.func.isRequired,
};

export default PropertiesPanel;
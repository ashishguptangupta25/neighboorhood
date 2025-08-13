import React from 'react';
import PropTypes from 'prop-types';

function PropertiesPanel({ selectedElement, updateElement, elements }) {
  if (!selectedElement) {
    return (
      <div className="properties-panel">
        <p>Select an element to edit its properties</p>
      </div>
    );
  }

  const handlePropertyChange = (key, value) => {
    updateElement(selectedElement.id, { [key]: value });
  };

  const handleNumberChange = (key, value) => {
    const numValue = parseFloat(value) || 0;
    updateElement(selectedElement.id, { [key]: numValue });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${selectedElement.name}"?`)) {
      updateElement(selectedElement.id, null);
    }
  };

  const renderTypeSpecificFields = () => {
    switch (selectedElement.type) {
      case 'building':
        return (
          <>
            <label>
              Width:
              <input
                type="number"
                min="10"
                value={selectedElement.width || 40}
                onChange={(e) => handleNumberChange('width', e.target.value)}
              />
            </label>
            <label>
              Height:
              <input
                type="number"
                min="10"
                value={selectedElement.height || 40}
                onChange={(e) => handleNumberChange('height', e.target.value)}
              />
            </label>
          </>
        );
      case 'road':
        return (
          <label>
            Width (Stroke):
            <input
              type="number"
              min="1"
              max="20"
              value={selectedElement.width || 5}
              onChange={(e) => handleNumberChange('width', e.target.value)}
            />
          </label>
        );
      case 'business':
        return (
          <label>
            Radius:
            <input
              type="number"
              min="5"
              max="50"
              value={selectedElement.radius || 20}
              onChange={(e) => handleNumberChange('radius', e.target.value)}
            />
          </label>
        );
      default:
        return null;
    }
  };

  return (
    <div className="properties-panel">
      <h3>Edit Properties</h3>
      <div className="property-group">
        <label>
          Name:
          <input
            type="text"
            value={selectedElement.name || ''}
            onChange={(e) => handlePropertyChange('name', e.target.value)}
          />
        </label>
      </div>
      
      <div className="property-group">
        <label>
          Description:
          <textarea
            value={selectedElement.description || ''}
            onChange={(e) => handlePropertyChange('description', e.target.value)}
            rows="2"
          />
        </label>
      </div>

      <div className="property-group">
        <label>
          Color:
          <input
            type="color"
            value={selectedElement.color || '#000000'}
            onChange={(e) => handlePropertyChange('color', e.target.value)}
          />
        </label>
      </div>

      <div className="property-group">
        <label>
          X Position:
          <input
            type="number"
            value={Math.round(selectedElement.x || 0)}
            onChange={(e) => handleNumberChange('x', e.target.value)}
          />
        </label>
      </div>

      <div className="property-group">
        <label>
          Y Position:
          <input
            type="number"
            value={Math.round(selectedElement.y || 0)}
            onChange={(e) => handleNumberChange('y', e.target.value)}
          />
        </label>
      </div>

      <div className="property-group">
        <label>Type: <strong>{selectedElement.type}</strong></label>
      </div>

      <div className="type-specific-properties">
        {renderTypeSpecificFields()}
      </div>

      <div className="property-group">
        <button 
          onClick={handleDelete}
          className="delete-button"
          type="button"
        >
          🗑️ Delete Element
        </button>
      </div>
    </div>
  );
}

PropertiesPanel.propTypes = {
  selectedElement: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    color: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    radius: PropTypes.number,
  }),
  updateElement: PropTypes.func.isRequired,
  elements: PropTypes.array.isRequired,
};

export default PropertiesPanel;
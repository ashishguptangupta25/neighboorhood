import React from 'react';
import PropTypes from 'prop-types';

function PropertiesPanel({ selectedElement, elements, setElements }) {
  const handlePropertyChange = (key, value) => {
    const updatedElements = elements.map((el) =>
      el.id === selectedElement.id ? { ...el, [key]: value } : el
    );
    setElements(updatedElements);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this element?')) {
      const updatedElements = elements.filter((el) => el.id !== selectedElement.id);
      setElements(updatedElements);
    }
  };

  if (!selectedElement) {
    return (
      <div className="properties-panel">
        <h3>Properties</h3>
        <p>Select an element to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="properties-panel">
      <h3>Edit Properties</h3>
      <div className="property-section">
        <label>
          Type:
          <input
            type="text"
            value={selectedElement.type || ''}
            disabled
            style={{ backgroundColor: '#f5f5f5' }}
          />
        </label>
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
            rows="2"
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
      </div>

      {/* Position controls */}
      <div className="property-section">
        <h4>Position</h4>
        {selectedElement.type !== 'road' && (
          <>
            <label>
              X:
              <input
                type="number"
                value={selectedElement.x || 0}
                onChange={(e) => handlePropertyChange('x', parseInt(e.target.value, 10) || 0)}
              />
            </label>
            <label>
              Y:
              <input
                type="number"
                value={selectedElement.y || 0}
                onChange={(e) => handlePropertyChange('y', parseInt(e.target.value, 10) || 0)}
              />
            </label>
          </>
        )}
      </div>

      {/* Size controls */}
      <div className="property-section">
        <h4>Size</h4>
        {selectedElement.type === 'road' ? (
          <label>
            Width (stroke):
            <input
              type="number"
              min="1"
              value={selectedElement.width || 5}
              onChange={(e) => handlePropertyChange('width', parseInt(e.target.value, 10) || 1)}
            />
          </label>
        ) : (
          <>
            <label>
              Width:
              <input
                type="number"
                min="10"
                value={selectedElement.width || 0}
                onChange={(e) => handlePropertyChange('width', parseInt(e.target.value, 10) || 10)}
              />
            </label>
            <label>
              Height:
              <input
                type="number"
                min="10"
                value={selectedElement.height || 0}
                onChange={(e) => handlePropertyChange('height', parseInt(e.target.value, 10) || 10)}
              />
            </label>
          </>
        )}
      </div>

      {/* Road-specific controls */}
      {selectedElement.type === 'road' && selectedElement.points && (
        <div className="property-section">
          <h4>Road Points</h4>
          <label>
            Start X:
            <input
              type="number"
              value={selectedElement.points[0] || 0}
              onChange={(e) => {
                const newPoints = [...selectedElement.points];
                newPoints[0] = parseInt(e.target.value, 10) || 0;
                handlePropertyChange('points', newPoints);
              }}
            />
          </label>
          <label>
            Start Y:
            <input
              type="number"
              value={selectedElement.points[1] || 0}
              onChange={(e) => {
                const newPoints = [...selectedElement.points];
                newPoints[1] = parseInt(e.target.value, 10) || 0;
                handlePropertyChange('points', newPoints);
              }}
            />
          </label>
          <label>
            End X:
            <input
              type="number"
              value={selectedElement.points[2] || 0}
              onChange={(e) => {
                const newPoints = [...selectedElement.points];
                newPoints[2] = parseInt(e.target.value, 10) || 0;
                handlePropertyChange('points', newPoints);
              }}
            />
          </label>
          <label>
            End Y:
            <input
              type="number"
              value={selectedElement.points[3] || 0}
              onChange={(e) => {
                const newPoints = [...selectedElement.points];
                newPoints[3] = parseInt(e.target.value, 10) || 0;
                handlePropertyChange('points', newPoints);
              }}
            />
          </label>
        </div>
      )}

      <div className="property-actions">
        <button onClick={handleDelete} className="delete-button">
          Delete Element
        </button>
      </div>
    </div>
  );
}

PropertiesPanel.propTypes = {
  selectedElement: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.oneOf(['building', 'road', 'business']).isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    color: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    points: PropTypes.arrayOf(PropTypes.number)
  }),
  elements: PropTypes.arrayOf(PropTypes.object).isRequired,
  setElements: PropTypes.func.isRequired
};

export default PropertiesPanel;
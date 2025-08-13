import React from 'react';
import PropTypes from 'prop-types';

function Toolbar({ selectedTool, setSelectedTool, addElement }) {
  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
  };

  const handleAddElement = (type) => {
    // Add element at a default position
    addElement(type, { 
      x: 100 + Math.random() * 200, 
      y: 100 + Math.random() * 200 
    });
    setSelectedTool('select'); // Switch back to select mode after adding
  };

  return (
    <div className="toolbar">
      <button 
        className={selectedTool === 'building' ? 'active' : ''}
        onClick={() => handleAddElement('building')}
      >
        Add Building
      </button>
      <button 
        className={selectedTool === 'road' ? 'active' : ''}
        onClick={() => handleAddElement('road')}
      >
        Add Road
      </button>
      <button 
        className={selectedTool === 'business' ? 'active' : ''}
        onClick={() => handleAddElement('business')}
      >
        Add Business
      </button>
      <button 
        className={selectedTool === 'select' ? 'active' : ''}
        onClick={() => handleToolSelect('select')}
      >
        Select
      </button>
    </div>
  );
}

Toolbar.propTypes = {
  selectedTool: PropTypes.string.isRequired,
  setSelectedTool: PropTypes.func.isRequired,
  addElement: PropTypes.func.isRequired,
};

export default Toolbar;
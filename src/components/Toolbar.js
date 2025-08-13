import React from 'react';
import PropTypes from 'prop-types';

function Toolbar({ elements, setElements }) {
  const generateId = () => Date.now() + Math.random();

  const addElement = (type) => {
    const baseElement = {
      id: generateId(),
      type,
      x: 100 + (elements.length * 50) % 400, // Offset new elements
      y: 100 + (Math.floor(elements.length / 8) * 50) % 300,
      name: `${type} ${elements.filter(el => el.type === type).length + 1}`,
      description: `A new ${type}`,
      color: getDefaultColor(type)
    };

    let newElement;
    switch (type) {
      case 'building':
        newElement = {
          ...baseElement,
          width: 60,
          height: 60
        };
        break;
      case 'road':
        newElement = {
          ...baseElement,
          points: [baseElement.x, baseElement.y, baseElement.x + 100, baseElement.y],
          width: 5 // stroke width for roads
        };
        break;
      case 'business':
        newElement = {
          ...baseElement,
          width: 40,
          height: 40
        };
        break;
      default:
        newElement = baseElement;
    }

    setElements([...elements, newElement]);
  };

  const getDefaultColor = (type) => {
    switch (type) {
      case 'building': return '#8B4513';
      case 'road': return '#404040';
      case 'business': return '#FF6B35';
      default: return '#808080';
    }
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all elements?')) {
      setElements([]);
    }
  };

  return (
    <div className="toolbar">
      <button onClick={() => addElement('building')}>Add Building</button>
      <button onClick={() => addElement('road')}>Add Road</button>
      <button onClick={() => addElement('business')}>Add Business</button>
      <button onClick={clearAll} className="clear-button">Clear All</button>
    </div>
  );
}

Toolbar.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.object).isRequired,
  setElements: PropTypes.func.isRequired
};

export default Toolbar;
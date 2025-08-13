import React from 'react';
import PropTypes from 'prop-types';

function Toolbar({ setElements }) {
  const addElement = (type) => {
    const newElement = {
      id: Date.now(),
      type,
      x: Math.random() * 400,
      y: Math.random() * 300,
      width: type === 'road' ? 100 : 50,
      height: type === 'road' ? 5 : 50,
      color: type === 'building' ? '#888888' : type === 'road' ? '#333333' : '#FF8C00',
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${Date.now()}`,
      description: `A ${type} element`,
    };

    if (type === 'road') {
      newElement.points = [newElement.x, newElement.y, newElement.x + newElement.width, newElement.y];
    }

    setElements(prev => [...prev, newElement]);
  };

  return (
    <div className="toolbar">
      <button onClick={() => addElement('building')}>Add Building</button>
      <button onClick={() => addElement('road')}>Add Road</button>
      <button onClick={() => addElement('business')}>Add Business</button>
    </div>
  );
}

Toolbar.propTypes = {
  setElements: PropTypes.func.isRequired,
};

export default Toolbar;
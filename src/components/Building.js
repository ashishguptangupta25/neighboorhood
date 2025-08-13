import React from 'react';
import PropTypes from 'prop-types';

function Building({ element, isSelected = false, onClick = () => {} }) {
  const styles = {
    border: isSelected ? '3px solid #007bff' : '1px solid #666',
    position: 'absolute',
    left: element.x || 0,
    top: element.y || 0,
    width: element.width || 60,
    height: element.height || 60,
    backgroundColor: element.color || '#8B4513',
    cursor: 'pointer',
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    boxSizing: 'border-box',
    pointerEvents: 'auto',
    zIndex: 100
  };

  return (
    <div style={styles} onClick={onClick} title={element.description}>
      {element.name}
    </div>
  );
}

Building.propTypes = {
  element: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.oneOf(['building']).isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func
};

export default Building;
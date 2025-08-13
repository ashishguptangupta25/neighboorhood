import React from 'react';
import PropTypes from 'prop-types';

function BusinessMarker({ element, isSelected = false, onClick = () => {} }) {
  const styles = {
    border: isSelected ? '3px solid #007bff' : '1px solid #333',
    position: 'absolute',
    left: element.x || 0,
    top: element.y || 0,
    width: element.width || 40,
    height: element.height || 40,
    backgroundColor: element.color || '#FF6B35',
    cursor: 'pointer',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    boxSizing: 'border-box',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    pointerEvents: 'auto',
    zIndex: 100
  };

  const iconStyles = {
    fontSize: '12px',
    lineHeight: 1
  };

  return (
    <div style={styles} onClick={onClick} title={element.description}>
      <span style={iconStyles}>🏪</span>
    </div>
  );
}

BusinessMarker.propTypes = {
  element: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.oneOf(['business']).isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func
};

export default BusinessMarker;
import React from 'react';
import PropTypes from 'prop-types';

function Road({ element, isSelected = false, onClick = () => {} }) {
  // Calculate road dimensions and position from points
  const points = element.points || [0, 0, 100, 0];
  const [x1, y1, x2, y2] = points;
  
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  const width = element.width || 5;

  const styles = {
    border: isSelected ? '2px solid #007bff' : 'none',
    position: 'absolute',
    left: Math.min(x1, x2),
    top: Math.min(y1, y2) - width / 2,
    width: length,
    height: width,
    backgroundColor: element.color || '#404040',
    cursor: 'pointer',
    transformOrigin: '0 50%',
    transform: `rotate(${angle}deg)`,
    borderRadius: '2px',
    pointerEvents: 'auto',
    zIndex: 100
  };

  // Label positioning
  const labelStyles = {
    position: 'absolute',
    left: (x1 + x2) / 2,
    top: (y1 + y2) / 2 - 10,
    fontSize: '8px',
    color: '#333',
    fontWeight: 'bold',
    background: 'rgba(255, 255, 255, 0.8)',
    padding: '1px 3px',
    borderRadius: '2px',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    zIndex: 101
  };

  return (
    <>
      <div style={styles} onClick={onClick} title={element.description}></div>
      {element.name && (
        <div style={labelStyles}>
          {element.name}
        </div>
      )}
    </>
  );
}

Road.propTypes = {
  element: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.oneOf(['road']).isRequired,
    points: PropTypes.arrayOf(PropTypes.number).isRequired,
    width: PropTypes.number,
    color: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func
};

export default Road;
import React from 'react';
import PropTypes from 'prop-types';

function Road({ 
  id, 
  points, 
  color, 
  width,
  name, 
  description, 
  isSelected, 
  onClick,
  onDoubleClick 
}) {
  const [x1, y1, x2, y2] = points;
  
  // Calculate road dimensions and position
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  
  const styles = {
    position: 'absolute',
    left: x1,
    top: y1 - width / 2,
    width: length,
    height: width,
    backgroundColor: color,
    border: isSelected ? '2px solid #007bff' : '1px solid rgba(0,0,0,0.2)',
    cursor: 'pointer',
    transformOrigin: '0 50%',
    transform: `rotate(${angle}deg)`,
    borderRadius: '2px',
    boxShadow: isSelected ? '0 0 10px rgba(0,123,255,0.3)' : 'none',
  };

  const labelStyles = {
    position: 'absolute',
    left: (x1 + x2) / 2,
    top: (y1 + y2) / 2 - 10,
    fontSize: '10px',
    color: '#333',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: '2px 4px',
    borderRadius: '2px',
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <>
      <div
        style={styles}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        title={description || name}
        data-element-id={id}
        data-element-type="road"
      />
      {isSelected && name && (
        <div style={labelStyles}>
          {name}
        </div>
      )}
    </>
  );
}

Road.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  points: PropTypes.arrayOf(PropTypes.number).isRequired,
  color: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
};

Road.defaultProps = {
  name: 'Road',
  description: '',
  isSelected: false,
  onClick: () => {},
  onDoubleClick: () => {},
};

export default Road;
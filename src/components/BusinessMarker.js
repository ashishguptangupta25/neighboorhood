import React from 'react';
import PropTypes from 'prop-types';

function BusinessMarker({ 
  id, 
  position, 
  size, 
  color, 
  name, 
  description, 
  isSelected, 
  onClick,
  onDoubleClick 
}) {
  const radius = Math.min(size.width, size.height) / 2;
  
  const styles = {
    position: 'absolute',
    left: position.x - radius,
    top: position.y - radius,
    width: radius * 2,
    height: radius * 2,
    backgroundColor: color,
    border: isSelected ? '2px solid #007bff' : '1px solid #ccc',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: '#fff',
    textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
    boxShadow: isSelected ? '0 0 10px rgba(0,123,255,0.3)' : '0 2px 6px rgba(0,0,0,0.2)',
  };

  const labelStyles = {
    position: 'absolute',
    left: position.x,
    top: position.y + radius + 5,
    fontSize: '10px',
    color: '#333',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: '2px 4px',
    borderRadius: '2px',
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    maxWidth: '80px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <>
      <div
        style={styles}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        title={description || name}
        data-element-id={id}
        data-element-type="business"
      >
        B
      </div>
      {name && (
        <div style={labelStyles}>
          {name}
        </div>
      )}
    </>
  );
}

BusinessMarker.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  size: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  color: PropTypes.string.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
};

BusinessMarker.defaultProps = {
  name: 'Business',
  description: '',
  isSelected: false,
  onClick: () => {},
  onDoubleClick: () => {},
};

export default BusinessMarker;
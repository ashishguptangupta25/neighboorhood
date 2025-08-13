import React from 'react';
import PropTypes from 'prop-types';

function Building({ 
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
  const styles = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    backgroundColor: color,
    border: isSelected ? '2px solid #007bff' : '1px solid #ccc',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#fff',
    textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
    borderRadius: '2px',
    boxShadow: isSelected ? '0 0 10px rgba(0,123,255,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
  };

  return (
    <div
      style={styles}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      title={description || name}
      data-element-id={id}
      data-element-type="building"
    >
      {name && name.length > 8 ? name.substring(0, 8) + '...' : name}
    </div>
  );
}

Building.propTypes = {
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

Building.defaultProps = {
  name: 'Building',
  description: '',
  isSelected: false,
  onClick: () => {},
  onDoubleClick: () => {},
};

export default Building;
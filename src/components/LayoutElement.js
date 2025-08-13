import React from 'react';
import PropTypes from 'prop-types';
import Building from './Building';
import Road from './Road';
import BusinessMarker from './BusinessMarker';

function LayoutElement({ element, isSelected, onClick, onDoubleClick }) {
  const commonProps = {
    id: element.id,
    name: element.name,
    description: element.description,
    color: element.color,
    isSelected,
    onClick,
    onDoubleClick,
  };

  switch (element.type) {
    case 'building':
      return (
        <Building
          {...commonProps}
          position={{ x: element.x, y: element.y }}
          size={{ width: element.width, height: element.height }}
        />
      );
    case 'road':
      return (
        <Road
          {...commonProps}
          points={element.points || [element.x, element.y, element.x + element.width, element.y]}
          width={element.height || element.width || 5}
        />
      );
    case 'business':
      return (
        <BusinessMarker
          {...commonProps}
          position={{ x: element.x, y: element.y }}
          size={{ width: element.width, height: element.height }}
        />
      );
    default:
      return null;
  }
}

LayoutElement.propTypes = {
  element: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.oneOf(['building', 'road', 'business']).isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    points: PropTypes.arrayOf(PropTypes.number),
    color: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
};

LayoutElement.defaultProps = {
  isSelected: false,
  onClick: () => {},
  onDoubleClick: () => {},
};

export default LayoutElement;
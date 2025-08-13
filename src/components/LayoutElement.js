import React from 'react';

function LayoutElement({ element, isSelected, onClick }) {
  const styles = {
    border: isSelected ? '2px solid blue' : 'none',
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    backgroundColor: element.color,
    cursor: 'pointer',
  };

  return <div style={styles} onClick={onClick}></div>;
}

export default LayoutElement;
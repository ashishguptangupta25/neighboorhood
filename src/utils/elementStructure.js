// Element structure definitions for neighborhood layout app

/**
 * Creates a new element with consistent structure
 * @param {string} type - Element type ('building', 'road', 'business')
 * @param {object} props - Element properties
 * @returns {object} Consistently structured element
 */
export const createElement = (type, props = {}) => {
  const baseElement = {
    id: Date.now() + Math.random(), // Unique ID generation
    type,
    name: props.name || `${type} ${Date.now()}`,
    description: props.description || '',
    color: props.color || getDefaultColor(type),
    x: props.x || 50,
    y: props.y || 50,
  };

  // Add type-specific properties
  switch (type) {
    case 'building':
      return {
        ...baseElement,
        width: props.width || 40,
        height: props.height || 40,
      };
    case 'road':
      return {
        ...baseElement,
        points: props.points || [baseElement.x, baseElement.y, baseElement.x + 100, baseElement.y],
        width: props.width || 5, // stroke width for roads
      };
    case 'business':
      return {
        ...baseElement,
        radius: props.radius || 20,
      };
    default:
      return baseElement;
  }
};

/**
 * Get default color for element type
 * @param {string} type - Element type
 * @returns {string} Default color
 */
export const getDefaultColor = (type) => {
  const colors = {
    building: '#808080', // gray
    road: '#000000',     // black
    business: '#FFA500', // orange
  };
  return colors[type] || '#000000';
};

/**
 * Validate element structure
 * @param {object} element - Element to validate
 * @returns {boolean} Whether element is valid
 */
export const validateElement = (element) => {
  if (!element || typeof element !== 'object') return false;
  
  const requiredFields = ['id', 'type', 'x', 'y', 'color', 'name'];
  
  for (const field of requiredFields) {
    if (!(field in element)) return false;
  }
  
  // Type-specific validations
  switch (element.type) {
    case 'building':
      return 'width' in element && 'height' in element;
    case 'road':
      return 'points' in element && Array.isArray(element.points) && element.points.length >= 4;
    case 'business':
      return 'radius' in element;
    default:
      return false;
  }
};

/**
 * Convert fabric.js object back to element data
 * @param {object} fabricObject - fabric.js object
 * @param {object} originalElement - Original element data
 * @returns {object} Updated element data
 */
export const fabricToElement = (fabricObject, originalElement) => {
  const baseUpdate = {
    ...originalElement,
    x: fabricObject.left,
    y: fabricObject.top,
    color: fabricObject.fill || fabricObject.stroke,
  };

  switch (originalElement.type) {
    case 'building':
      return {
        ...baseUpdate,
        width: fabricObject.width * fabricObject.scaleX,
        height: fabricObject.height * fabricObject.scaleY,
      };
    case 'road':
      return {
        ...baseUpdate,
        points: [fabricObject.x1, fabricObject.y1, fabricObject.x2, fabricObject.y2],
        width: fabricObject.strokeWidth,
      };
    case 'business':
      return {
        ...baseUpdate,
        radius: fabricObject.radius * fabricObject.scaleX,
      };
    default:
      return baseUpdate;
  }
};
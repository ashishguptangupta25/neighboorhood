export const validateLayoutJson = (json) => {
  if (!Array.isArray(json)) return false;

  return json.every((element) => {
    // Basic required properties
    const hasBasicProps = (
      (typeof element.id === 'number' || typeof element.id === 'string') &&
      typeof element.type === 'string' &&
      ['building', 'road', 'business'].includes(element.type) &&
      typeof element.color === 'string'
    );

    if (!hasBasicProps) return false;

    // Type-specific validation
    if (element.type === 'road') {
      return (
        Array.isArray(element.points) &&
        element.points.length === 4 &&
        element.points.every(point => typeof point === 'number') &&
        typeof element.width === 'number'
      );
    } else {
      return (
        typeof element.x === 'number' &&
        typeof element.y === 'number' &&
        typeof element.width === 'number' &&
        typeof element.height === 'number'
      );
    }
  });
};

export const validateElement = (element) => {
  if (!element || typeof element !== 'object') return false;
  
  const requiredProps = ['id', 'type', 'name', 'color'];
  const hasRequired = requiredProps.every(prop => 
    element.hasOwnProperty(prop) && element[prop] !== null && element[prop] !== undefined
  );
  
  if (!hasRequired) return false;
  
  // Type-specific validation
  switch (element.type) {
    case 'building':
    case 'business':
      return typeof element.x === 'number' && 
             typeof element.y === 'number' && 
             typeof element.width === 'number' && 
             typeof element.height === 'number';
    case 'road':
      return Array.isArray(element.points) && 
             element.points.length === 4 &&
             typeof element.width === 'number';
    default:
      return false;
  }
};
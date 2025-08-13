export const validateLayoutJson = (json) => {
  if (!Array.isArray(json)) return false;

  return json.every((element) => {
    // Check required base properties
    const hasRequiredProps = (
      (typeof element.id === 'number' || typeof element.id === 'string') &&
      typeof element.type === 'string' &&
      typeof element.x === 'number' &&
      typeof element.y === 'number' &&
      typeof element.color === 'string' &&
      typeof element.name === 'string'
    );

    if (!hasRequiredProps) return false;

    // Type-specific validation
    switch (element.type) {
      case 'building':
        return typeof element.width === 'number' && typeof element.height === 'number';
      case 'road':
        return Array.isArray(element.points) && element.points.length >= 4 &&
               typeof element.width === 'number';
      case 'business':
        return typeof element.radius === 'number';
      default:
        return false; // Unknown type
    }
  });
};
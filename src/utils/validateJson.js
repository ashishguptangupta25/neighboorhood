export const validateLayoutJson = (json) => {
  if (!Array.isArray(json)) return false;

  return json.every((element) => {
    // Required fields
    const hasRequiredFields = (
      typeof element.id === 'number' &&
      typeof element.type === 'string' &&
      typeof element.x === 'number' &&
      typeof element.y === 'number'
    );

    // Valid type
    const validTypes = ['building', 'road', 'business'];
    const hasValidType = validTypes.includes(element.type);

    // Type-specific validation
    let typeSpecificValid = true;
    if (element.type === 'road') {
      typeSpecificValid = Array.isArray(element.points) && element.points.length >= 4;
    }

    return hasRequiredFields && hasValidType && typeSpecificValid;
  });
};
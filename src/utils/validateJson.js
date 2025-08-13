export const validateLayoutJson = (json) => {
  if (!Array.isArray(json)) return false;

  return json.every((element) => {
    return (
      typeof element.id === 'number' &&
      typeof element.type === 'string' &&
      typeof element.x === 'number' &&
      typeof element.y === 'number'
    );
  });
};
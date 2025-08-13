export const loadLayoutFromLocalStorage = () => {
  const savedLayout = localStorage.getItem('neighborhoodLayout');
  return savedLayout ? JSON.parse(savedLayout) : null;
};

export const saveLayoutToLocalStorage = (layout) => {
  localStorage.setItem('neighborhoodLayout', JSON.stringify(layout));
};
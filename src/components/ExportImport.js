import React from 'react';
import PropTypes from 'prop-types';
import { validateLayoutJson } from '../utils/validateJson';

function ExportImport({ elements, setElements }) {
  const exportLayout = () => {
    const exportData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      elements: elements.map(element => ({
        id: element.id,
        type: element.type,
        name: element.name || '',
        description: element.description || '',
        color: element.color,
        ...(element.type === 'road' ? {
          points: element.points,
          width: element.width
        } : {
          x: element.x,
          y: element.y,
          width: element.width,
          height: element.height
        })
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `neighborhood-layout-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importLayout = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Handle both old format (direct array) and new format (object with elements)
        const elementsToImport = Array.isArray(data) ? data : data.elements;
        
        if (!validateLayoutJson(elementsToImport)) {
          alert('Invalid JSON file format. Please ensure all elements have required properties.');
          return;
        }

        // Validate each element has required properties
        const validElements = elementsToImport.filter(element => {
          const hasBasicProps = element.id && element.type && element.color;
          
          if (element.type === 'road') {
            return hasBasicProps && Array.isArray(element.points) && element.points.length === 4;
          } else {
            return hasBasicProps && typeof element.x === 'number' && typeof element.y === 'number';
          }
        });

        if (validElements.length !== elementsToImport.length) {
          const skipped = elementsToImport.length - validElements.length;
          alert(`Imported ${validElements.length} elements. Skipped ${skipped} invalid elements.`);
        }

        setElements(validElements);
        alert(`Successfully imported ${validElements.length} elements.`);
      } catch (error) {
        console.error('Import error:', error);
        alert('Invalid JSON file format. Please check the file and try again.');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    e.target.value = '';
  };

  return (
    <div className="export-import">
      <button onClick={exportLayout} className="export-button">
        Export Layout ({elements.length} elements)
      </button>
      <input
        type="file"
        accept=".json,application/json"
        onChange={importLayout}
        style={{ display: 'none' }}
        id="import-layout"
      />
      <label htmlFor="import-layout" className="import-button">
        Import Layout
      </label>
    </div>
  );
}

ExportImport.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.oneOf(['building', 'road', 'business']).isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    color: PropTypes.string.isRequired
  })).isRequired,
  setElements: PropTypes.func.isRequired
};

export default ExportImport;
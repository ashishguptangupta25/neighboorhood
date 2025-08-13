import React from 'react';
import PropTypes from 'prop-types';
import { validateLayoutJson } from '../utils/validateJson';

function ExportImport({ elements, setElements }) {
  const exportLayout = () => {
    try {
      const dataStr = JSON.stringify(elements, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'neighborhood-layout.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error exporting layout: ' + error.message);
    }
  };

  const importLayout = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const layout = JSON.parse(event.target.result);
        
        // Validate the imported layout
        if (validateLayoutJson(layout)) {
          setElements(layout);
          alert('Layout imported successfully!');
        } else {
          alert('Invalid layout file format. Please check that all elements have required properties.');
        }
      } catch (error) {
        alert('Invalid JSON file format: ' + error.message);
      }
    };
    
    reader.onerror = () => {
      alert('Error reading file');
    };
    
    reader.readAsText(file);
    
    // Clear the input so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="export-import">
      <button onClick={exportLayout} disabled={elements.length === 0}>
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
  elements: PropTypes.array.isRequired,
  setElements: PropTypes.func.isRequired,
};

export default ExportImport;
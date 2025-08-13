import React from 'react';
import PropTypes from 'prop-types';
import { validateLayoutJson } from '../utils/validateJson';

function ExportImport({ elements, setElements }) {
  const exportLayout = () => {
    const dataStr = JSON.stringify(elements, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'neighborhood-layout.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importLayout = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const layout = JSON.parse(event.target.result);
        if (validateLayoutJson(layout)) {
          setElements(layout);
        } else {
          alert('Invalid JSON file format. Please ensure the file contains valid neighborhood layout data.');
        }
      } catch (error) {
        alert('Invalid JSON file format. Unable to parse the file.');
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  return (
    <div className="export-import">
      <button onClick={exportLayout}>Export Layout</button>
      <input
        type="file"
        accept="application/json"
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
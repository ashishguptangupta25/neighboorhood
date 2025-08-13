import React from 'react';

function ExportImport({ elements, setElements }) {
  const exportLayout = () => {
    const dataStr = JSON.stringify(elements, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'neighborhood-layout.json';
    link.click();
  };

  const importLayout = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const layout = JSON.parse(event.target.result);
        setElements(layout);
      } catch (error) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
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

export default ExportImport;
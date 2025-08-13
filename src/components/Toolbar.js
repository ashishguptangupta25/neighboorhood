import React from 'react';

function Toolbar({ setTool }) {
  return (
    <div className="toolbar">
      <button onClick={() => setTool('building')}>Add Building</button>
      <button onClick={() => setTool('road')}>Add Road</button>
      <button onClick={() => setTool('business')}>Add Business</button>
      <button onClick={() => setTool('select')}>Select</button>
    </div>
  );
}

export default Toolbar;
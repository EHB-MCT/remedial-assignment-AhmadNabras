import React from 'react';
import ColoniesList from './pages/ColoniesList';
import CreateColony from './components/CreateColony';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Space Colonies</h1>
      {/* Colony creation form */}
      <CreateColony />

      <hr style={{ margin: '20px 0' }} />

      {/* Colonies list */}
      <ColoniesList />
    </div>
  );
}

export default App;

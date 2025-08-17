// src/App.jsx
import React from 'react';
import ColoniesList from './pages/ColoniesList';
import CreateColony from './components/CreateColony';
import Analytics from './components/Analytics'; // ✅ import Analytics

function App() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#111', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', textAlign: 'center' }}>🚀 Space Colonies</h1>

      {/* Colony creation form */}
      <CreateColony />

      <hr style={{ margin: '20px 0' }} />

      {/* Colonies list */}
      <ColoniesList />

      <hr style={{ margin: '20px 0' }} />

      {/* ✅ Analytics Section */}
      <Analytics />
    </div>
  );
}

export default App;

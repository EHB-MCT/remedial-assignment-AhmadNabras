import React from 'react';
import ColoniesList from './pages/ColoniesList';
import CreateColony from './components/CreateColony';
import Analytics from './components/Analytics';

function App() {
  return (
    <div style={{ backgroundColor: '#111', minHeight: '100vh', width: '100%' }}>
      <h1 style={{ color: 'white', textAlign: 'center', margin: '20px 0' }}>
        🚀 Space Colonies
      </h1>

      {/* Intro text */}
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto 30px auto',
          textAlign: 'center',
          color: '#ddd',
          lineHeight: '1.8',
        }}
      >
        <h2 style={{ color: '#fff', marginBottom: '10px' }}>
          Welcome to Space Colonies 🚀
        </h2>
        <p style={{ fontSize: '1.2rem' }}>
          Build and manage colonies that consume and produce resources. <br />
          We recommend starting with <strong>3 colonies</strong>, each with a
          different production type. <br />
          <strong>
            You can make maximum of 5 colonies and each colony can have maximum
            of 50 resources.
          </strong>
        </p>
        <p style={{ marginTop: '15px', fontSize: '1.2rem' }}>
          💡 <strong>Tip:</strong> Check the reports and live analytics to see
          which resources are used most. Use this insight to create your{' '}
          <strong>4th</strong> and <strong>5th</strong> colonies and keep your
          colonies alive longer!
        </p>
      </div>

      {/* Colony creation form */}
      <CreateColony />

      <hr style={{ margin: '20px 0', borderColor: '#333' }} />

      {/* Colonies list */}
      <ColoniesList />

      <hr style={{ margin: '20px 0', borderColor: '#333' }} />

      {/* Analytics Section */}
      <Analytics />
    </div>
  );
}

export default App;

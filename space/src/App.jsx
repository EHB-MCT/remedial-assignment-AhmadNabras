import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ColoniesList from './pages/ColoniesList';
import CreateColony from './components/CreateColony';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ColoniesList />} />
        <Route path="/create" element={<CreateColony />} />
      </Routes>
    </Router>
  );
}

export default App;

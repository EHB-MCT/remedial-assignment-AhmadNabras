import React, { useEffect, useState } from 'react';
import { getColonies, createColony } from '../services/api';

const ColoniesManager = () => {
  const [colonies, setColonies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    water: '',
    oxygen: '',
    energy: '',
    production: 'water'
  });
  const [creating, setCreating] = useState(false);

  // Fetch colonies
  const fetchColonies = () => {
    setLoading(true);
    getColonies()
      .then(res => {
        setColonies(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching colonies:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchColonies();
  }, []);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setCreating(true);
    createColony(formData)
      .then(() => {
        setFormData({
          name: '',
          water: '',
          oxygen: '',
          energy: '',
          production: 'water'
        });
        setCreating(false);
        fetchColonies(); // refresh list
      })
      .catch(err => {
        console.error("Error creating colony:", err);
        setCreating(false);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Space Colonies</h1>

      {/* Create Colony Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Colony Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Water"
          value={formData.water}
          onChange={(e) => setFormData({ ...formData, water: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Oxygen"
          value={formData.oxygen}
          onChange={(e) => setFormData({ ...formData, oxygen: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Energy"
          value={formData.energy}
          onChange={(e) => setFormData({ ...formData, energy: e.target.value })}
          required
        />
        <select
          value={formData.production}
          onChange={(e) => setFormData({ ...formData, production: e.target.value })}
        >
          <option value="water">Water</option>
          <option value="oxygen">Oxygen</option>
          <option value="energy">Energy</option>
        </select>
        <button type="submit" disabled={creating}>
          {creating ? 'Creating...' : 'Create Colony'}
        </button>
      </form>

      {/* Colonies List */}
      {loading ? (
        <p>Loading colonies...</p>
      ) : colonies.length === 0 ? (
        <p>No colonies found.</p>
      ) : (
        <ul>
          {colonies.map(colony => (
            <li key={colony._id}>
              <strong>{colony.name}</strong>  
              <span> | Water: {colony.water}</span>  
              <span> | Oxygen: {colony.oxygen}</span>  
              <span> | Energy: {colony.energy}</span>
              <span> | Production: {colony.production}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ColoniesManager;

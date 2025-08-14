import React, { useState, useEffect } from 'react';
import { createColony, getColonies } from '../services/api';

const CreateColony = () => {
  const [colonies, setColonies] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    water: '',
    oxygen: '',
    energy: '',
    production: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch colonies on page load
  useEffect(() => {
    fetchColonies();
  }, []);

  const fetchColonies = async () => {
    try {
      const res = await getColonies();
      setColonies(res.data);
    } catch (err) {
      console.error('Error fetching colonies:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createColony(formData);
      setFormData({
        name: '',
        water: '',
        oxygen: '',
        energy: '',
        production: '',
      });
      fetchColonies(); // Refresh the list
    } catch (err) {
      console.error('Error creating colony:', err);
      setError(err.response?.data?.error || 'Server error creating colony');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Create a New Colony</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="name"
          placeholder="Colony Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="water"
          placeholder="Water Seeds"
          value={formData.water}
          onChange={handleChange}
        />
        <input
          type="number"
          name="oxygen"
          placeholder="Oxygen Seeds"
          value={formData.oxygen}
          onChange={handleChange}
        />
        <input
          type="number"
          name="energy"
          placeholder="Energy Seeds"
          value={formData.energy}
          onChange={handleChange}
        />

        <select
          name="production"
          value={formData.production}
          onChange={handleChange}
          required
        >
          <option value="">Select Production Type</option>
          <option value="water">Water</option>
          <option value="oxygen">Oxygen</option>
          <option value="energy">Energy</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Colony'}
        </button>
      </form>

      <h2>Colonies List</h2>
      {colonies.length === 0 ? (
        <p>No colonies yet.</p>
      ) : (
        <ul>
          {colonies.map((colony) => (
            <li key={colony._id}>
              <strong>{colony.name}</strong> | Water: {colony.water} | Oxygen: {colony.oxygen} | Energy: {colony.energy} | Producing: {colony.production}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CreateColony;

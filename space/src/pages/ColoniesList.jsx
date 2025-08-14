import React, { useEffect, useState } from 'react';
import { getColonies, createColony } from '../services/api';

const ColoniesList = () => {
  const [colonies, setColonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    water: 0,
    oxygen: 0,
    energy: 0,
    production: 'water'
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch colonies
  const fetchColonies = () => {
    setLoading(true);
    getColonies()
      .then(res => {
        setColonies(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching colonies:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchColonies();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['water', 'oxygen', 'energy'].includes(name)
        ? Number(value)
        : value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    setSuccess('');

    try {
      await createColony(formData);
      setSuccess('✅ Colony created successfully!');
      setFormData({
        name: '',
        water: 0,
        oxygen: 0,
        energy: 0,
        production: 'water'
      });
      fetchColonies(); // Refresh the list
    } catch (err) {
      console.error('Error creating colony:', err);
      setError(err.response?.data?.error || 'Server error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Space Colonies</h1>

      {/* Create Colony Form */}
      <div
        style={{
          marginBottom: '30px',
          border: '1px solid #ccc',
          padding: '15px',
          borderRadius: '8px'
        }}
      >
        <h2>Create New Colony</h2>
        {error && <p style={{ color: 'red' }}>❌ {error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <label>
            Colony Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <br /><br />

          <label>
            Water Seeds:
            <input
              type="number"
              name="water"
              value={formData.water}
              onChange={handleChange}
              min="0"
            />
          </label>
          <br /><br />

          <label>
            Oxygen Seeds:
            <input
              type="number"
              name="oxygen"
              value={formData.oxygen}
              onChange={handleChange}
              min="0"
            />
          </label>
          <br /><br />

          <label>
            Energy Seeds:
            <input
              type="number"
              name="energy"
              value={formData.energy}
              onChange={handleChange}
              min="0"
            />
          </label>
          <br /><br />

          <label>
            Production Type:
            <select
              name="production"
              value={formData.production}
              onChange={handleChange}
              required
            >
              <option value="water">Water</option>
              <option value="oxygen">Oxygen</option>
              <option value="energy">Energy</option>
            </select>
          </label>
          <br /><br />

          <button type="submit" disabled={creating}>
            {creating ? 'Creating...' : 'Create Colony'}
          </button>
        </form>
      </div>

      {/* Colony List */}
      {loading ? (
        <p>Loading colonies...</p>
      ) : (
        <ul>
          {colonies.map(colony => (
            <li
              key={colony._id}
              style={{
                marginBottom: '15px',
                borderBottom: '1px solid #ddd',
                paddingBottom: '10px'
              }}
            >
              <strong>{colony.name}</strong> <br />
              🌊 Water: {colony.water} <br />
              🌬 Oxygen: {colony.oxygen} <br />
              ⚡ Energy: {colony.energy} <br />
              🛠 Production: {colony.production} <br />
              ⏱ Consumption Rate: {colony.consumptionRate} ms <br />
              📉 Consumption Amount: {colony.consumptionAmount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ColoniesList;

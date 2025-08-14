import React, { useEffect, useState } from 'react';
import { getColonies, createColony, deleteColony } from '../services/api';

const ColoniesManager = () => {
  const [colonies, setColonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    water: '',
    oxygen: '',
    energy: '',
    production: ''
  });

  const fetchColonies = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createColony(form);
      setForm({ name: '', water: '', oxygen: '', energy: '', production: '' });
      fetchColonies();
    } catch (err) {
      console.error('Error creating colony:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteColony(id);
      setColonies(prev => prev.filter(colony => colony._id !== id));
    } catch (err) {
      console.error('Error deleting colony:', err);
    }
  };

  if (loading) return <p>Loading colonies...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Create Colony</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Colony Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Water"
          value={form.water}
          onChange={(e) => setForm({ ...form, water: e.target.value })}
        />
        <input
          type="number"
          placeholder="Oxygen"
          value={form.oxygen}
          onChange={(e) => setForm({ ...form, oxygen: e.target.value })}
        />
        <input
          type="number"
          placeholder="Energy"
          value={form.energy}
          onChange={(e) => setForm({ ...form, energy: e.target.value })}
        />
        <select
          value={form.production}
          onChange={(e) => setForm({ ...form, production: e.target.value })}
          required
        >
          <option value="">Select Production Type</option>
          <option value="water">Water</option>
          <option value="oxygen">Oxygen</option>
          <option value="energy">Energy</option>
        </select>
        <button type="submit">Create Colony</button>
      </form>

      <h2>Colonies List</h2>
      <ul>
        {colonies.map(colony => (
          <li key={colony._id} style={{ marginBottom: '10px' }}>
            <strong>{colony.name}</strong>
            <span> | Water: {colony.water}</span>
            <span> | Oxygen: {colony.oxygen}</span>
            <span> | Energy: {colony.energy}</span>
            <span> | Production: {colony.production}</span>
            <button
              onClick={() => handleDelete(colony._id)}
              style={{
                marginLeft: '10px',
                background: 'red',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ColoniesManager;

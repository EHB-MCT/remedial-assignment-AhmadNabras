import React, { useState } from 'react';
import { createColony } from '../services/api';

const CreateColony = () => {
  const [formData, setFormData] = useState({
    name: '',
    water: 0,
    oxygen: 0,
    energy: 0,
    production: 'water'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['water', 'oxygen', 'energy'].includes(name)
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await createColony(formData);
      setSuccess('✅ Colony created successfully!');
      setFormData({ name: '', water: 0, oxygen: 0, energy: 0, production: 'water' });
    } catch (err) {
      console.error('Error creating colony:', err);
      setError(err.response?.data?.error || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
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

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Colony'}
        </button>
      </form>
    </div>
  );
};

export default CreateColony;

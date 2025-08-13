import React, { useState } from 'react';
import { createColony } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateColony = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    water: '',
    oxygen: '',
    energy: '',
    production: '',
    consumption: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createColony(formData);
      navigate('/'); // go back to list after adding
    } catch (err) {
      console.error("Error creating colony:", err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Create New Colony</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Colony Name" onChange={handleChange} required /><br />
        <input name="water" type="number" placeholder="Water" onChange={handleChange} required /><br />
        <input name="oxygen" type="number" placeholder="Oxygen" onChange={handleChange} required /><br />
        <input name="energy" type="number" placeholder="Energy" onChange={handleChange} required /><br />
        <input name="production" type="number" placeholder="Production" onChange={handleChange} required /><br />
        <input name="consumption" type="number" placeholder="Consumption" onChange={handleChange} required /><br />
        <button type="submit">Add Colony</button>
      </form>
    </div>
  );
};

export default CreateColony;

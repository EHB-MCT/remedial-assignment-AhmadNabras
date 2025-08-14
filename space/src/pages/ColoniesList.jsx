import React, { useEffect, useState } from 'react';
import { getColonies, deleteColony } from '../services/api';

const ColoniesList = () => {
  const [colonies, setColonies] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <h1>Colonies</h1>
      <ul>
        {colonies.map(colony => (
          <li key={colony._id}>
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

export default ColoniesList;

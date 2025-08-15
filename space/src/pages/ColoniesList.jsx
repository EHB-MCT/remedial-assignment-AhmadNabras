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
        console.error("Error fetching colonies:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchColonies();
  }, []);

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this colony?");
    if (!confirmed) return;

    deleteColony(id)
      .then(() => {
        setColonies(colonies.filter(colony => colony._id !== id));
      })
      .catch(err => {
        console.error("Error deleting colony:", err);
      });
  };

  if (loading) return <p>Loading colonies...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Space Colonies</h1>
      <ul>
        {colonies.map(colony => (
          <li key={colony._id}>
            <strong>{colony.name}</strong>
            <span> | Water: {colony.water}</span>
            <span> | Oxygen: {colony.oxygen}</span>
            <span> | Energy: {colony.energy}</span>
            <span> | Production: {colony.production}</span>
            <button
              style={{ marginLeft: '10px', background: 'red', color: 'white' }}
              onClick={() => handleDelete(colony._id)}
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

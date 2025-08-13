import React, { useEffect, useState } from 'react';
import { getColonies } from '../services/api';
import { Link } from 'react-router-dom';

const ColoniesList = () => {
  const [colonies, setColonies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getColonies()
      .then(res => {
        setColonies(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching colonies:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>Loading colonies...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>🚀 Space Colonies</h1>

      {/* Create Colony Button */}
      <div style={{ margin: '10px 0' }}>
        <Link to="/create">
          <button style={{
            backgroundColor: '#2e5d3d',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            + Create New Colony
          </button>
        </Link>
      </div>

      {/* Colonies List */}
      {colonies.length === 0 ? (
        <p>No colonies found. Start by creating one!</p>
      ) : (
        <ul>
          {colonies.map(colony => (
            <li key={colony._id} style={{ marginBottom: '8px' }}>
              <strong>{colony.name}</strong>
              <span> | 💧 Water: {colony.water}</span>
              <span> | 🌬 Oxygen: {colony.oxygen}</span>
              <span> | ⚡ Energy: {colony.energy}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ColoniesList;

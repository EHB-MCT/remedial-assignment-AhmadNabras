import React, { useEffect, useState } from 'react';
import { getColonies } from '../services/api';

const ColoniesList = () => {
  const [colonies, setColonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch colonies from backend
  useEffect(() => {
    fetchColonies();
  }, []);

  const fetchColonies = async () => {
    try {
      const res = await getColonies();
      setColonies(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching colonies:', err);
      setError('Failed to load colonies');
      setLoading(false);
    }
  };

  if (loading) return <p>Loading colonies...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Space Colonies</h1>
      {colonies.length === 0 ? (
        <p>No colonies created yet.</p>
      ) : (
        <ul>
          {colonies.map(colony => (
            <li key={colony._id}>
              <strong>{colony.name}</strong>  
              <span> | Water: {colony.water}</span>  
              <span> | Oxygen: {colony.oxygen}</span>  
              <span> | Energy: {colony.energy}</span>  
              <span> | Production: {colony.production}</span>  
              <span> | Consumption Rate: {colony.consumptionRate}ms</span>  
              <span> | Consumption Amount: {colony.consumptionAmount}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ColoniesList;

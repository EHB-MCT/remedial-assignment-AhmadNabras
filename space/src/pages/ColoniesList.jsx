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
    <div style={styles.page}>
      <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Space Colonies</h1>
      <div style={styles.grid}>
        {colonies.map(colony => (
          <div key={colony._id} style={styles.card}>
            <h2 style={styles.name}>{colony.name}</h2>

            <div style={styles.row}>
              <span>Water</span>
              <span>{colony.water}</span>
            </div>
            <div style={styles.row}>
              <span>Oxygen</span>
              <span>{colony.oxygen}</span>
            </div>
            <div style={styles.row}>
              <span>Energy</span>
              <span>{colony.energy}</span>
            </div>

            <div style={styles.production}>
              <span>Production: {colony.production}</span>
              <span>{colony.productionAmount || 0}</span>
            </div>

            <button
              style={styles.deleteBtn}
              onClick={() => handleDelete(colony._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    padding: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: '250px', // fixed card height
  },
  name: {
    textAlign: 'center',
    color: '#555',
    marginBottom: '15px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0',
    color: '#555',
  },
  production: {
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '5px',
    padding: '5px 10px',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  deleteBtn: {
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    alignSelf: 'center',
  },
};

export default ColoniesList;

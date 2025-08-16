import React, { useEffect, useState } from 'react';
import { getColonies, deleteColony, deleteAllColonies } from '../services/api';
import axios from 'axios';

const ColoniesList = () => {
  const [colonies, setColonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null); // resource popup
  const [transferAmount, setTransferAmount] = useState(0);
  const [targetColony, setTargetColony] = useState('');

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
    const interval = setInterval(fetchColonies, 3000);
    return () => clearInterval(interval);
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

  const handleRestart = () => {
    const confirmed = window.confirm("Are you sure you want to restart the game? All colonies will be lost!");
    if (!confirmed) return;

    deleteAllColonies()
      .then(() => {
        setColonies([]);
      })
      .catch(err => console.error("Error restarting game:", err));
  };

  const handleTransfer = async (fromColonyId, resource) => {
    if (!targetColony || transferAmount <= 0) {
      alert("Please select a colony and enter a valid amount");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/colonies/transfer', {
        fromColonyId,
        toColonyId: targetColony,
        resource,
        amount: parseInt(transferAmount, 10)
      });
      fetchColonies();
      setPopup(null); // close popup
      setTransferAmount(0);
      setTargetColony('');
    } catch (err) {
      console.error("Error transferring resources:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Transfer failed");
    }
  };

  if (loading) return <p>Loading colonies...</p>;

  return (
    <div style={styles.page}>
      <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Space Colonies</h1>
      <button style={styles.restartBtn} onClick={handleRestart}>Restart Game</button>

      <div style={styles.grid}>
        {colonies.map(colony => (
          <div key={colony._id} style={styles.card}>
            <h2 style={styles.name}>{colony.name}</h2>

            {colony.dead && <p style={{ color: 'red', textAlign: 'center' }}>☠ Colony has died</p>}

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

            <div
              style={styles.production}
              onClick={() => setPopup({ colony, resource: colony.production })}
            >
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

      {/* Popup */}
      {popup && (
        <div style={styles.popup}>
          <h2>{popup.colony.name} - Send {popup.resource}</h2>
          <select
            value={targetColony}
            onChange={(e) => setTargetColony(e.target.value)}
          >
            <option value="">Select target colony</option>
            {colonies.filter(c => c._id !== popup.colony._id).map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
          />
          <button onClick={() => handleTransfer(popup.colony._id, popup.resource)}>Send</button>
          <button onClick={() => setPopup(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#111',
  },
  restartBtn: {
    backgroundColor: 'orange',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
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
    justifyContent: 'space-between',
    height: '250px',
    position: 'relative',
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
    cursor: 'pointer',
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
  popup: {
    position: 'fixed',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -30%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    zIndex: 1000,
  },
};

export default ColoniesList;

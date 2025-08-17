import React, { useEffect, useState } from 'react';
import { getColonies, deleteColony, deleteAllColonies } from '../services/api';
import axios from 'axios';

const ColoniesList = () => {
  const [colonies, setColonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);
  const [transferData, setTransferData] = useState({}); // {colonyId: amount}

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
        alert(err.response?.data?.error || "Error deleting colony");
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
    try {
      const requests = Object.entries(transferData)
        .filter(([colonyId, amount]) => amount > 0)
        .map(([colonyId, amount]) => {
          if (colonyId === fromColonyId) {
            // ✅ Use internally
            return axios.post(`http://localhost:5000/api/colonies/${fromColonyId}/use`, {
              resource,
              amount: parseInt(amount, 10),
            });
          } else {
            // ✅ Transfer externally
            return axios.post('http://localhost:5000/api/colonies/transfer', {
              fromColonyId,
              toColonyId: colonyId,
              resource,
              amount: parseInt(amount, 10),
            });
          }
        });

      await Promise.all(requests);

      fetchColonies();
      setPopup(null);
      setTransferData({});
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
              style={{
                ...styles.production,
                backgroundColor: colony.productionAmount >= 50 ? 'gray' : '#007bff'
              }}
              onClick={() => !colony.dead && setPopup({ colony, resource: colony.production })}
            >
              <span>Production: {colony.production}</span>
              <span>
                {colony.productionAmount || 0}
                {colony.productionAmount >= 50 && ' (Full)'}
              </span>
            </div>

            {!colony.dead && (
              <button
                style={styles.deleteBtn}
                onClick={() => handleDelete(colony._id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ✅ Popup with all colonies listed */}
      {popup && (
        <div style={styles.popup}>
          <h2>{popup.colony.name} - Manage {popup.resource}</h2>

          <div style={styles.popupList}>
            {colonies.map(c => {
              // Pick correct resource value
              const resourceValue = c[popup.resource];
              let color = 'black';
              if (resourceValue < 5) color = 'red';
              else if (resourceValue < 10) color = 'orange';

              return (
                <div key={c._id} style={styles.popupRow}>
                  <span style={{ fontWeight: 'bold', color }}>{c.name} ({popup.resource}: {resourceValue})</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Amount"
                    value={transferData[c._id] || ''}
                    onChange={(e) =>
                      setTransferData({
                        ...transferData,
                        [c._id]: e.target.value
                      })
                    }
                    style={styles.input}
                  />
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '15px' }}>
            <button onClick={() => handleTransfer(popup.colony._id, popup.resource)}>Send Resources</button>
            <button onClick={() => setPopup(null)} style={{ marginLeft: '10px' }}>Close</button>
          </div>
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
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -20%)',
    backgroundColor: 'black',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)',
    zIndex: 1000,
    minWidth: '400px',
  },
  popupList: {
    marginTop: '10px',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  popupRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  input: {
    width: '80px',
    marginLeft: '10px',
  },
};

export default ColoniesList;

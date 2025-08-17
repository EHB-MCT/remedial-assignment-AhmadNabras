// src/pages/ColoniesList.jsx
import React, { useEffect, useState } from "react";
import {
  getColonies,
  deleteColony,
  deleteAllColonies,
} from "../services/api";
import axios from "axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ColoniesList = () => {
  const [colonies, setColonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);
  const [transferData, setTransferData] = useState({});
  const [analyticsData, setAnalyticsData] = useState({});
  const [selectedColony, setSelectedColony] = useState("all");
  const [selectedMetric, setSelectedMetric] = useState("all");

  const fetchColonies = async () => {
    try {
      const res = await getColonies();
      const data = res.data;
      setColonies(data);

      const now = new Date().toLocaleTimeString();

      setAnalyticsData((prev) => {
        const newData = { ...prev };
        data.forEach((c) => {
          if (c.dead) {
            if (!newData[c._id]) newData[c._id] = [];
            return;
          }
          const entry = {
            time: now,
            water: c.water,
            oxygen: c.oxygen,
            energy: c.energy,
            production: c.productionAmount,
          };
          if (!newData[c._id]) newData[c._id] = [];
          newData[c._id] = [...newData[c._id], entry].slice(-20);
        });
        return newData;
      });

      setLoading(false);
    } catch (err) {
      console.error("Error fetching colonies:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColonies();
    const interval = setInterval(fetchColonies, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this colony?");
    if (!confirmed) return;

    try {
      await deleteColony(id);
      setColonies(colonies.filter((colony) => colony._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting colony");
    }
  };

  const handleRestart = async () => {
    const confirmed = window.confirm("Are you sure you want to restart the game? All colonies will be lost!");
    if (!confirmed) return;

    try {
      await deleteAllColonies();
      setColonies([]);
      setAnalyticsData({});
    } catch (err) {
      console.error("Error restarting game:", err);
    }
  };

  const handleTransfer = async (fromColonyId, resource) => {
    try {
      const requests = Object.entries(transferData)
        .filter(([colonyId, amount]) => parseInt(amount, 10) > 0)
        .map(([colonyId, amount]) => {
          return axios.post("http://localhost:5000/api/colonies/transfer", {
            fromColonyId,
            toColonyId: colonyId,
            resource,
            amount: parseInt(amount, 10),
          });
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

  // ✅ Build chart data
  let chartData = [];
  if (selectedColony === "all") {
    const colonyIds = Object.keys(analyticsData);
    if (colonyIds.length > 0) {
      const maxLength = Math.max(...colonyIds.map((id) => analyticsData[id]?.length || 0));
      chartData = Array.from({ length: maxLength }, (_, idx) => {
        const row = {
          time: analyticsData[colonyIds[0]]?.[idx]?.time || idx,
        };
        colonyIds.forEach((id) => {
          const entry = analyticsData[id]?.[idx];
          if (entry) {
            row[`${id}-water`] = entry.water;
            row[`${id}-oxygen`] = entry.oxygen;
            row[`${id}-energy`] = entry.energy;
            row[`${id}-production`] = entry.production;
          }
        });
        return row;
      });
    }
  } else {
    chartData = analyticsData[selectedColony] || [];
  }

  const COLORS = ["#8884d8", "#82ca9d", "#ff7300", "#00bfff"];

  // ✅ Build chart lines cleanly
  let chartLines = [];
  if (selectedColony === "all") {
    chartLines = Object.keys(analyticsData).flatMap((id, idx) => {
      const colony = colonies.find((c) => c._id === id);
      if (!colony) return [];
      if (selectedMetric === "all") {
        return [
          <Line key={`${id}-water`} dataKey={`${id}-water`} stroke={COLORS[0]} name={`${colony.name} - Water`} />,
          <Line key={`${id}-oxygen`} dataKey={`${id}-oxygen`} stroke={COLORS[1]} name={`${colony.name} - Oxygen`} />,
          <Line key={`${id}-energy`} dataKey={`${id}-energy`} stroke={COLORS[2]} name={`${colony.name} - Energy`} />,
          <Line key={`${id}-production`} dataKey={`${id}-production`} stroke={COLORS[3]} name={`${colony.name} - Production`} />,
        ];
      }
      return [
        <Line
          key={`${id}-${selectedMetric}`}
          dataKey={`${id}-${selectedMetric}`}
          stroke={COLORS[idx % COLORS.length]}
          name={`${colony.name} - ${selectedMetric}`}
        />,
      ];
    });
  } else {
    if (selectedMetric === "all") {
      chartLines = [
        <Line key="water" dataKey="water" stroke={COLORS[0]} name="Water" />,
        <Line key="oxygen" dataKey="oxygen" stroke={COLORS[1]} name="Oxygen" />,
        <Line key="energy" dataKey="energy" stroke={COLORS[2]} name="Energy" />,
        <Line key="production" dataKey="production" stroke={COLORS[3]} name="Production" />,
      ];
    } else {
      chartLines = [
        <Line key={selectedMetric} dataKey={selectedMetric} stroke={COLORS[0]} name={selectedMetric} />,
      ];
    }
  }

  return (
    <div style={styles.page}>
      <h1 style={{ color: "#fff", textAlign: "center", marginBottom: "20px" }}>Space Colonies</h1>
      <button style={styles.restartBtn} onClick={handleRestart}>Restart Game</button>

      {/* Colony Cards */}
      <div style={styles.grid}>
        {colonies.map((colony) => (
          <div key={colony._id} style={styles.card}>
            <h2 style={styles.name}>{colony.name}</h2>
            {colony.dead && <p style={{ color: "red", textAlign: "center" }}>☠ Colony has died</p>}
            <div style={styles.row}><span>Water</span><span>{colony.water}</span></div>
            <div style={styles.row}><span>Oxygen</span><span>{colony.oxygen}</span></div>
            <div style={styles.row}><span>Energy</span><span>{colony.energy}</span></div>

            <button
              style={{
                ...styles.production,
                backgroundColor: colony.productionAmount >= 50 ? "gray" : "#007bff",
              }}
              disabled={colony.dead}
              onClick={() => setPopup({ colony, resource: colony.production })}
            >
              <span>Production: {colony.production}</span>
              <span>{colony.productionAmount || 0} {colony.productionAmount >= 50 && " (Full)"}</span>
            </button>

            {!colony.dead && (
              <button style={styles.deleteBtn} onClick={() => handleDelete(colony._id)}>Delete</button>
            )}
          </div>
        ))}
      </div>

      {/* Popup for transfers */}
      {popup && (
        <div style={styles.popup}>
          <h2>{popup.colony.name} - Send {popup.resource}</h2>
          <div style={styles.popupList}>
            {colonies.map((c) => {
              const resourceValue = c[popup.resource];
              let color = "black";
              if (resourceValue < 5) color = "red";
              else if (resourceValue < 10) color = "orange";
              return (
                <div key={c._id} style={styles.popupRow}>
                  <span style={{ fontWeight: "bold", color }}>
                    {c.name} ({popup.resource}: {resourceValue})
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Amount"
                    value={transferData[c._id] || ""}
                    onChange={(e) => setTransferData({ ...transferData, [c._id]: e.target.value })}
                    style={styles.input}
                  />
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: "15px" }}>
            <button onClick={() => handleTransfer(popup.colony._id, popup.resource)}>Send Resources</button>
            <button onClick={() => setPopup(null)} style={{ marginLeft: "10px" }}>Close</button>
          </div>
        </div>
      )}

      {/* Analytics Section */}
      <div style={styles.analyticsSection}>
        <h2 style={{ color: "white" }}>Colony Analytics</h2>
        <p style={{ color: "#ccc", marginBottom: "10px", fontSize: "0.85rem", maxWidth: "700px" }}>
          This chart shows the evolution of water, oxygen, energy, and production storage for your colonies.
        </p>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="colonySelect" style={{ color: "white" }}>Select Colony: </label>
          <select id="colonySelect" value={selectedColony} onChange={(e) => setSelectedColony(e.target.value)}>
            <option value="all">All Colonies</option>
            {colonies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>

          <label htmlFor="metricSelect" style={{ color: "white", marginLeft: "20px" }}>Select Metric: </label>
          <select id="metricSelect" value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
            <option value="all">All Metrics</option>
            <option value="water">Water</option>
            <option value="oxygen">Oxygen</option>
            <option value="energy">Energy</option>
            <option value="production">Production</option>
          </select>
        </div>

        <ResponsiveContainer width="80%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 50]} ticks={[0, 10, 20, 30, 40, 50]} />
            <Tooltip />
            <Legend />
            {chartLines}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: "100vh", padding: "20px", backgroundColor: "#111" },
  restartBtn: {
    backgroundColor: "orange", color: "white", border: "none",
    padding: "10px 20px", borderRadius: "5px", cursor: "pointer",
    marginBottom: "20px", display: "block", marginLeft: "auto", marginRight: "auto",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" },
  card: {
    backgroundColor: "#fff", borderRadius: "20px", padding: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column",
    justifyContent: "space-between", height: "250px",
  },
  name: { textAlign: "center", color: "#555", marginBottom: "15px" },
  row: { display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#555" },
  production: {
    color: "#fff", borderRadius: "5px", padding: "5px 10px", display: "flex",
    justifyContent: "space-between", marginTop: "10px", border: "none",
  },
  deleteBtn: {
    backgroundColor: "red", color: "white", border: "none", padding: "5px 10px",
    borderRadius: "5px", cursor: "pointer", marginTop: "10px", alignSelf: "center",
  },
  popup: {
    position: "fixed", top: "20%", left: "50%", transform: "translate(-50%, -20%)",
    backgroundColor: "black", padding: "20px", borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(255, 255, 255, 0.3)", zIndex: 1000,
    minWidth: "450px", color: "white",
  },
  popupList: { marginTop: "10px", maxHeight: "300px", overflowY: "auto" },
  popupRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  input: { width: "80px", marginLeft: "10px" },
  analyticsSection: {
    marginTop: "40px", background: "#222", padding: "20px",
    borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center",
  },
};

export default ColoniesList;

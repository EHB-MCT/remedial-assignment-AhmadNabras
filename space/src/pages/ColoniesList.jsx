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

  // Fetch colonies
  const fetchColonies = async () => {
    try {
      const res = await getColonies();
      setColonies(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching colonies:", err);
      setLoading(false);
    }
  };

  // Fetch history of one colony
  const fetchHistory = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/colonies/${id}/history`
      );
      return res.data.map((h) => ({
        time: new Date(h.timestamp).toLocaleTimeString(),
        water: h.water,
        oxygen: h.oxygen,
        energy: h.energy,
        production: h.production,
      }));
    } catch (err) {
      console.error("Error fetching history:", err);
      return [];
    }
  };

  // Update analytics data
  useEffect(() => {
    if (colonies.length === 0) return;

    if (selectedColony === "all") {
      Promise.all(colonies.map((c) => fetchHistory(c._id))).then(
        (allHistories) => {
          const dataById = {};
          colonies.forEach((c, idx) => {
            dataById[c._id] = allHistories[idx];
          });
          setAnalyticsData(dataById);
        }
      );
    } else {
      fetchHistory(selectedColony).then((history) => {
        setAnalyticsData({ [selectedColony]: history });
      });
    }
  }, [selectedColony, colonies]);

  useEffect(() => {
    fetchColonies();
    const interval = setInterval(fetchColonies, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this colony?");
    if (!confirmed) return;

    try {
      await deleteColony(id);
      setColonies(colonies.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting colony");
    }
  };

  const handleRestart = async () => {
    const confirmed = window.confirm("Restart game? All colonies lost!");
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
        .map(([colonyId, amount]) =>
          axios.post("http://localhost:5000/api/colonies/transfer", {
            fromColonyId,
            toColonyId: colonyId,
            resource,
            amount: parseInt(amount, 10),
          })
        );

      await Promise.all(requests);
      fetchColonies();
      setPopup(null);
      setTransferData({});
    } catch (err) {
      console.error("Transfer error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Transfer failed");
    }
  };

  if (loading) return <p style={{ color: "white" }}>Loading colonies...</p>;

  // Build chart data
  let chartData = [];
  if (selectedColony === "all") {
    const colonyIds = Object.keys(analyticsData);
    if (colonyIds.length > 0) {
      const maxLength = Math.max(
        ...colonyIds.map((id) => analyticsData[id]?.length || 0)
      );
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

  // Build chart lines
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
        <Line key={`${id}-${selectedMetric}`} dataKey={`${id}-${selectedMetric}`} stroke={COLORS[idx % COLORS.length]} name={`${colony.name} - ${selectedMetric}`} />,
      ];
    });
  } else {
    chartLines =
      selectedMetric === "all"
        ? [
            <Line key="water" dataKey="water" stroke={COLORS[0]} name="Water" />,
            <Line key="oxygen" dataKey="oxygen" stroke={COLORS[1]} name="Oxygen" />,
            <Line key="energy" dataKey="energy" stroke={COLORS[2]} name="Energy" />,
            <Line key="production" dataKey="production" stroke={COLORS[3]} name="Production" />,
          ]
        : [
            <Line key={selectedMetric} dataKey={selectedMetric} stroke={COLORS[0]} name={selectedMetric} />,
          ];
  }

  return (
    <div style={styles.page}>
      <button style={styles.restartBtn} onClick={handleRestart}>
        Restart Game
      </button>

      {/* Colony Cards */}
      <div style={styles.grid}>
        {colonies.map((colony) => (
          <div key={colony._id} style={styles.card}>
            <h2 style={styles.name}>
              {colony.name} (production: {colony.production})
            </h2>
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
              // ✅ FIXED: use actual resource type
              onClick={() => setPopup({ colony, resource: colony.production })}
            >
              <span>Production: {colony.production}</span>
              <span>{colony.productionAmount || 0} {colony.productionAmount >= 50 && " (Full)"}</span>
            </button>

            {!colony.dead && (
              <button style={styles.deleteBtn} onClick={() => handleDelete(colony._id)}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Popup */}
      {popup && (
        <div style={styles.popup}>
          <h2>
            {popup.colony.name} - Send {popup.resource}
          </h2>
          <div style={styles.popupList}>
            {colonies.map((c) => {
              const resourceValue = c[popup.resource];
              let color = "white";
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

      {/* Analytics */}
      <div style={styles.analyticsSection}>
        <h2>Colony Analytics</h2>
        <p style={{ marginBottom: "10px", fontSize: "0.9rem", color: "#aaa" }}>
          This chart shows the evolution of water, oxygen, energy, and production.
        </p>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="colonySelect">Select Colony: </label>
          <select id="colonySelect" value={selectedColony} onChange={(e) => setSelectedColony(e.target.value)}>
            <option value="all">All Colonies</option>
            {colonies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>

          <label htmlFor="metricSelect" style={{ marginLeft: "20px" }}>Select Metric: </label>
          <select id="metricSelect" value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
            <option value="all">All Metrics</option>
            <option value="water">Water</option>
            <option value="oxygen">Oxygen</option>
            <option value="energy">Energy</option>
            <option value="production">Production</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="time" stroke="#aaa" />
            <YAxis domain={["auto", "auto"]} stroke="#aaa" />
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
  page: { 
    minHeight: "100vh", 
    padding: "20px", 
    backgroundColor: "#000", 
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center", 
  },
  restartBtn: {
    backgroundColor: "orange",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    justifyContent: "center",
    width: "100%",
    maxWidth: "1200px",
  },
  card: {
    backgroundColor: "#1c1c1c",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "250px",
    color: "white",
  },
  name: { textAlign: "center", color: "#fff", marginBottom: "15px" },
  row: { display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#ccc" },
  production: {
    color: "#fff",
    borderRadius: "5px",
    padding: "5px 10px",
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    border: "none",
  },
  deleteBtn: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
    alignSelf: "center",
  },
  popup: {
    position: "fixed",
    top: "20%",
    left: "50%",
    transform: "translate(-50%, -20%)",
    backgroundColor: "#111",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(255,255,255,0.2)",
    zIndex: 1000,
    minWidth: "450px",
    color: "white",
  },
  popupList: { marginTop: "10px", maxHeight: "300px", overflowY: "auto" },
  popupRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  input: { width: "80px", marginLeft: "10px" },
  analyticsSection: {
    marginTop: "40px",
    background: "#1c1c1c",
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "1200px",
    margin: "40px auto",
    boxShadow: "0 4px 10px rgba(0,0,0,0.6)",
    color: "white",
  },
};

export default ColoniesList;

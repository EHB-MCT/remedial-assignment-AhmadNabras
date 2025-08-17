// src/components/Analytics.jsx
import React, { useEffect, useState } from "react";
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
  BarChart,
  Bar,
} from "recharts";
import { deleteAllColonies } from "../services/api";

const Analytics = () => {
  const [colonies, setColonies] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedColony, setSelectedColony] = useState("all");
  const [selectedMetric, setSelectedMetric] = useState("all");

  // Fetch colonies list
  const fetchColonies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/colonies");
      setColonies(res.data);
    } catch (err) {
      console.error("Error fetching colonies:", err);
    }
  };

  // Fetch history (for one colony or all)
  const fetchHistory = async () => {
    try {
      if (selectedColony === "all") {
        const res = await axios.get(
          "http://localhost:5000/api/colonies/history/all"
        );
        setHistory(res.data); // ✅ keep history, even if colonies are dead
      } else {
        const res = await axios.get(
          `http://localhost:5000/api/colonies/${selectedColony}/history`
        );
        setHistory(res.data);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  // Refresh colonies once on mount
  useEffect(() => {
    fetchColonies();
  }, []);

  // Refresh history on colony change + every 10s
  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, [selectedColony]);

  // ✅ Restart clears analytics as well
  const handleRestart = async () => {
    if (!window.confirm("Restart game? All data will be lost.")) return;
    try {
      await deleteAllColonies();
      setColonies([]);
      setHistory([]); // reset history
    } catch (err) {
      console.error("Error restarting game:", err);
    }
  };

  // Bar chart snapshot → current resources
  const barData = colonies.map((col) => ({
    name: col.name + (col.dead ? " ☠" : ""),
    water: col.water,
    oxygen: col.oxygen,
    energy: col.energy,
    production: col.productionAmount,
  }));

  // Color palette
  const COLORS = {
    water: "#1f77b4",
    oxygen: "#2ca02c",
    energy: "#d62728",
    production: "#9467bd",
  };

  const metricOptions = ["water", "oxygen", "energy", "production"];

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "center", color: "#fff" }}>📊 Colony Analytics</h2>
      <button style={styles.restartBtn} onClick={handleRestart}>
        Restart Game
      </button>

      {colonies.length === 0 && history.length === 0 && (
        <p style={{ color: "white", textAlign: "center" }}>
          ⚠ No colonies yet. Create one to see analytics.
        </p>
      )}

      {history.length > 0 && (
        <>
          {/* Controls */}
          <div style={styles.controls}>
            <div>
              <label style={{ color: "white", marginRight: "8px" }}>
                Select Colony:
              </label>
              <select
                value={selectedColony}
                onChange={(e) => setSelectedColony(e.target.value)}
              >
                <option value="all">All Colonies (avg)</option>
                {colonies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} {c.dead ? "☠" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ color: "white", marginRight: "8px" }}>
                Select Metric:
              </label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
              >
                <option value="all">All Metrics</option>
                {metricOptions.map((m) => (
                  <option key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Line Chart */}
          <div style={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={history}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 50]} ticks={[0, 10, 20, 30, 40, 50]} />
                <Tooltip />
                <Legend />
                {selectedMetric === "all"
                  ? metricOptions.map((key) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={COLORS[key]}
                        name={key.charAt(0).toUpperCase() + key.slice(1)}
                      />
                    ))
                  : (
                    <Line
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke={COLORS[selectedMetric]}
                      name={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
                    />
                  )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div style={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 50]} />
                <Tooltip />
                <Legend />
                {selectedMetric === "all"
                  ? metricOptions.map((key) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        fill={COLORS[key]}
                        name={key.charAt(0).toUpperCase() + key.slice(1)}
                      />
                    ))
                  : (
                    <Bar
                      dataKey={selectedMetric}
                      fill={COLORS[selectedMetric]}
                      name={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
                    />
                  )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#111",
    minHeight: "100vh",
  },
  restartBtn: {
    backgroundColor: "orange",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    marginBottom: "20px",
  },
  chartWrapper: {
    marginBottom: "40px",
    background: "#222",
    padding: "20px",
    borderRadius: "10px",
  },
};

export default Analytics;

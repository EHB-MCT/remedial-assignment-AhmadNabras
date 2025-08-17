// src/components/Analytics.jsx
import React, { useEffect, useState } from "react";
import { getColonies } from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const [colonies, setColonies] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedColony, setSelectedColony] = useState("all");
  const [selectedAnalytics, setSelectedAnalytics] = useState("resource-history");

  // Fetch colonies from backend
  const fetchColonies = async () => {
    try {
      const res = await getColonies();
      setColonies(res.data);

      // Build snapshot for history
      const snapshot = {
        time: new Date().toLocaleTimeString(),
      };

      if (selectedColony === "all") {
        snapshot.water = res.data.reduce((acc, c) => acc + c.water, 0);
        snapshot.oxygen = res.data.reduce((acc, c) => acc + c.oxygen, 0);
        snapshot.energy = res.data.reduce((acc, c) => acc + c.energy, 0);
      } else {
        const colony = res.data.find((c) => c._id === selectedColony);
        if (colony) {
          snapshot.water = colony.water;
          snapshot.oxygen = colony.oxygen;
          snapshot.energy = colony.energy;
        }
      }

      setHistory((prev) => [...prev.slice(-20), snapshot]); // keep last 20 snapshots
    } catch (err) {
      console.error("Error fetching colonies:", err);
    }
  };

  useEffect(() => {
    fetchColonies();
    const interval = setInterval(fetchColonies, 5000); // refresh every 5 sec
    return () => clearInterval(interval);
  }, [selectedColony]);

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "center", color: "#fff" }}>Analytics</h2>

      {/* Dropdowns */}
      <div style={styles.controls}>
        <select
          value={selectedColony}
          onChange={(e) => setSelectedColony(e.target.value)}
        >
          <option value="all">All Colonies</option>
          {colonies.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={selectedAnalytics}
          onChange={(e) => setSelectedAnalytics(e.target.value)}
        >
          <option value="resource-history">Resource History</option>
          <option value="production-consumption">Production vs Consumption</option>
          <option value="transfers">Transfers</option>
          <option value="lifespan">Lifespan</option>
          <option value="summary">Game Summary</option>
        </select>
      </div>

      {/* Chart area */}
      <div style={styles.chartArea}>
        {selectedAnalytics === "resource-history" && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="water" stroke="#00f" />
              <Line type="monotone" dataKey="oxygen" stroke="#0f0" />
              <Line type="monotone" dataKey="energy" stroke="#f00" />
            </LineChart>
          </ResponsiveContainer>
        )}

        {selectedAnalytics !== "resource-history" && (
          <p style={{ color: "#fff" }}>
            ⚠ This analytics type is not implemented yet.
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#111",
    minHeight: "100vh",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "20px",
  },
  chartArea: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
  },
};

export default Analytics;

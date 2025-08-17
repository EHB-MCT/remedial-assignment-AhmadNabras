// src/components/Analytics.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Analytics = () => {
  const [colonies, setColonies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch colonies (live)
  const fetchColonies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/colonies");
      setColonies(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching colonies:", err);
      setLoading(false);
    }
  };

  // Refresh every 10s automatically
  useEffect(() => {
    fetchColonies();
    const interval = setInterval(fetchColonies, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString() : "—";

  const calcReport = (colony) => {
    const { history, createdAt, deadSince } = colony;
    let survivalMinutes = 0;
    if (deadSince && createdAt) {
      survivalMinutes = Math.round(
        (new Date(deadSince) - new Date(createdAt)) / 60000
      );
    } else if (createdAt) {
      survivalMinutes = Math.round(
        (new Date() - new Date(createdAt)) / 60000
      );
    }

    // Resource usage
    const totals = { water: 0, oxygen: 0, energy: 0 };
    let totalProduction = 0;

    if (history && history.length > 1) {
      for (let i = 1; i < history.length; i++) {
        const prev = history[i - 1];
        const curr = history[i];

        ["water", "oxygen", "energy"].forEach((res) => {
          if (curr[res] < prev[res]) {
            totals[res] += prev[res] - curr[res];
          }
        });

        if (curr.production > prev.production) {
          totalProduction += curr.production - prev.production;
        }
      }
    }

    return { survivalMinutes, totals, totalProduction };
  };

  if (loading) {
    return <p style={{ color: "white", textAlign: "center" }}>Loading report...</p>;
  }

  if (colonies.length === 0) {
    return <p style={{ color: "white", textAlign: "center" }}>⚠ No colonies yet.</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "center", color: "#fff" }}>📑 Colony Report</h2>

      {colonies.map((col) => {
        const { survivalMinutes, totals, totalProduction } = calcReport(col);

        return (
          <div key={col._id} style={styles.card}>
            <h3 style={{ color: col.dead ? "red" : "orange" }}>
              {col.name} {col.dead ? "☠" : ""}
            </h3>
            <p><strong>Created:</strong> {formatDate(col.createdAt)}</p>
            <p><strong>Died:</strong> {col.dead ? formatDate(col.deadSince) : "Still alive"}</p>
            <p><strong>Survival Time:</strong> {survivalMinutes} minutes</p>

            <h4>Resource Usage</h4>
            <ul>
              <li>Water consumed: {totals.water}</li>
              <li>Oxygen consumed: {totals.oxygen}</li>
              <li>Energy consumed: {totals.energy}</li>
            </ul>

            <h4>Production</h4>
            <p>Total produced: {totalProduction}</p>

            <h4>Transfers</h4>
            <p>(Transfer history not tracked yet)</p>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#111",
    minHeight: "100vh",
  },
  card: {
    background: "#222",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "8px",
    color: "white",
  },
};

export default Analytics;

import React, { useEffect, useState } from "react";
import axios from "axios";

const Analytics = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reports from backend
  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/colonies/reports/all");
      setReports(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 10000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  const formatDate = (d) => (d ? new Date(d).toLocaleString() : "—");

  if (loading) {
    return <p style={{ color: "white", textAlign: "center" }}>Loading report...</p>;
  }

  if (reports.length === 0) {
    return <p style={{ color: "white", textAlign: "center" }}>⚠ No colonies yet.</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "center", color: "#fff" }}>📑 Colony Report</h2>

      {reports.map((rep, idx) => (
        <div key={idx} style={styles.card}>
          <h3 style={{ color: rep.emoji === "☠" ? "red" : "orange" }}>
            {rep.name} {rep.emoji}
          </h3>
          {rep.message ? (
            <p>{rep.message}</p>
          ) : (
            <>
              <p><strong>Created:</strong> {formatDate(rep.startTime)}</p>
              <p><strong>Died:</strong> {rep.deathTime ? formatDate(rep.deathTime) : "Still alive"}</p>
              <p><strong>⏱ Survival:</strong> {rep.survivalMinutes} minutes</p>

              <h4>🔋 Resource Usage</h4>
              <ul>
                <li>💧 Water used: {rep.waterUsed}</li>
                <li>🌬 Oxygen used: {rep.oxygenUsed}</li>
                <li>⚡ Energy used: {rep.energyUsed}</li>
              </ul>

              <h4>🏭 Production</h4>
              <p>Total produced: {rep.totalProduction}</p>
            </>
          )}
        </div>
      ))}
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

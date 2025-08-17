// src/pages/ColoniesManager.jsx
import React, { useEffect, useState } from "react";
import { getColonies, createColony, deleteColony } from "../services/api";
import Analytics from "../components/Analytics";

const ColoniesManager = () => {
  const [colonies, setColonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    water: "",
    oxygen: "",
    energy: "",
    production: "",
  });

  // ✅ Fetch colonies
  const fetchColonies = () => {
    getColonies()
      .then((res) => {
        setColonies(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching colonies:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchColonies();
  }, []);

  // ✅ Create colony
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createColony(form);
      setForm({ name: "", water: "", oxygen: "", energy: "", production: "" });
      fetchColonies();
    } catch (err) {
      alert(err.response?.data?.error || "Error creating colony");
      console.error("Error creating colony:", err);
    }
  };

  // ✅ Delete colony
  const handleDelete = async (id) => {
    try {
      await deleteColony(id);
      setColonies((prev) => prev.filter((colony) => colony._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting colony");
      console.error("Error deleting colony:", err);
    }
  };

  if (loading) return <p style={{ color: "white" }}>Loading colonies...</p>;

  return (
    <div style={styles.page}>
      <h1 style={{ textAlign: "center", color: "white", marginBottom: "20px" }}>
        Colony Manager
      </h1>

      {/* Colony creation form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Colony Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Water"
          value={form.water}
          onChange={(e) => setForm({ ...form, water: e.target.value })}
        />
        <input
          type="number"
          placeholder="Oxygen"
          value={form.oxygen}
          onChange={(e) => setForm({ ...form, oxygen: e.target.value })}
        />
        <input
          type="number"
          placeholder="Energy"
          value={form.energy}
          onChange={(e) => setForm({ ...form, energy: e.target.value })}
        />
        <select
          value={form.production}
          onChange={(e) => setForm({ ...form, production: e.target.value })}
          required
        >
          <option value="">Select Production Type</option>
          <option value="water">Water</option>
          <option value="oxygen">Oxygen</option>
          <option value="energy">Energy</option>
        </select>
        <button type="submit" style={styles.createBtn}>
          Create Colony
        </button>
      </form>

      {/* Colonies list */}
      <h2 style={{ color: "white" }}>Colonies List</h2>
      <ul>
        {colonies.map((colony) => (
          <li key={colony._id} style={styles.colonyItem}>
            <strong>{colony.name}</strong>
            <span> | Water: {colony.water}</span>
            <span> | Oxygen: {colony.oxygen}</span>
            <span> | Energy: {colony.energy}</span>
            <span> | Production: {colony.production}</span>
            {colony.dead && <span style={{ color: "red" }}> ☠ Dead</span>}
            {!colony.dead && (
              <button
                onClick={() => handleDelete(colony._id)}
                style={styles.deleteBtn}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* ✅ Analytics section */}
      <div style={{ marginTop: "40px" }}>
        <Analytics />
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "20px",
    backgroundColor: "#111",
    minHeight: "100vh",
  },
  form: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  createBtn: {
    background: "green",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
  colonyItem: {
    color: "white",
    marginBottom: "10px",
  },
  deleteBtn: {
    marginLeft: "10px",
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default ColoniesManager;

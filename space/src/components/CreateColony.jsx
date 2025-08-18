import React, { useState } from "react";
import PropTypes from "prop-types";
import { createColony } from "../services/api";

const CreateColony = ({ onColonyCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    water: "",
    oxygen: "",
    energy: "",
    production: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createColony(formData);
      setFormData({
        name: "",
        water: "",
        oxygen: "",
        energy: "",
        production: "",
      });

      if (onColonyCreated) {
        onColonyCreated(); // refresh colonies in parent
      }
    } catch (err) {
      console.error("Error creating colony:", err);
      setError(err.response?.data?.error || "Server error creating colony");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🪐 Create a New Colony</h2>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Colony Name */}
        <div style={styles.inputGroup}>
          <label htmlFor="name" style={styles.label}>Colony Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter colony name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        {/* Water Seeds */}
        <div style={styles.inputGroup}>
          <label htmlFor="water" style={styles.label}>Water Seeds</label>
          <input
            id="water"
            type="number"
            name="water"
            placeholder="Water amount"
            value={formData.water}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* Oxygen Seeds */}
        <div style={styles.inputGroup}>
          <label htmlFor="oxygen" style={styles.label}>Oxygen Seeds</label>
          <input
            id="oxygen"
            type="number"
            name="oxygen"
            placeholder="Oxygen amount"
            value={formData.oxygen}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* Energy Seeds */}
        <div style={styles.inputGroup}>
          <label htmlFor="energy" style={styles.label}>Energy Seeds</label>
          <input
            id="energy"
            type="number"
            name="energy"
            placeholder="Energy amount"
            value={formData.energy}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* Production */}
        <div style={styles.inputGroup}>
          <label htmlFor="production" style={styles.label}>Production Type</label>
          <select
            id="production"
            name="production"
            value={formData.production}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">Select Production</option>
            <option value="water">Water</option>
            <option value="oxygen">Oxygen</option>
            <option value="energy">Energy</option>
          </select>
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Creating..." : "Create Colony"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    background: "#fff",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    maxWidth: "500px",
    margin: "20px auto 40px auto",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    color: "#333",
  },
  error: {
    color: "red",
    marginBottom: "15px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    color: "#333",             
    backgroundColor: "#fff",   
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    backgroundColor: "#fff",   
    color: "#333",             
  },
  button: {
    backgroundColor: "#2e5d3d",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
};

CreateColony.propTypes = {
  onColonyCreated: PropTypes.func,
};

export default CreateColony;

// backend/models/Colony.js
const mongoose = require('mongoose');

const colonySchema = new mongoose.Schema({
  name: String,
  water: Number,
  oxygen: Number,
  energy: Number,
  production: {
    water: Number,
    oxygen: Number,
    energy: Number,
  },
  consumption: {
    water: Number,
    oxygen: Number,
    energy: Number,
  },
});

module.exports = mongoose.model('Colony', colonySchema);

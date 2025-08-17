// backend/models/Colony.js
import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    water: { type: Number, default: 0, min: 0, max: 50 },
    oxygen: { type: Number, default: 0, min: 0, max: 50 },
    energy: { type: Number, default: 0, min: 0, max: 50 },
    production: { type: Number, default: 0, min: 0, max: 50 },
    dead: { type: Boolean, default: false },
  },
  { _id: false } // prevent subdocument _id clutter
);

const ColonySchema = new mongoose.Schema({
  name: { type: String, required: true },
  water: { type: Number, default: 0, min: 0, max: 50 },
  oxygen: { type: Number, default: 0, min: 0, max: 50 },
  energy: { type: Number, default: 0, min: 0, max: 50 },

  production: {
    type: String,
    enum: ['water', 'oxygen', 'energy'],
    required: true,
  },

  productionAmount: { type: Number, default: 0, min: 0, max: 50 },
  consumptionRate: { type: Number, default: 3000 }, // ms between consumptions
  consumptionAmount: { type: Number, default: 1 }, // how much is consumed each tick

  dead: { type: Boolean, default: false },
  deadSince: { type: Date, default: null },

  history: [HistorySchema],
});

export default mongoose.model('Colony', ColonySchema);

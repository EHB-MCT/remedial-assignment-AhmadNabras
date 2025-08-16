// backend/server/models/Colony.js
import mongoose from 'mongoose';

const ColonySchema = new mongoose.Schema({
  name: { type: String, required: true },
  water: { type: Number, default: 0 },
  oxygen: { type: Number, default: 0 },
  energy: { type: Number, default: 0 },
  production: {
    type: String,
    enum: ['water', 'oxygen', 'energy'],
    required: true,
  },
  productionAmount: { type: Number, default: 0 },
  productionStorage: { type: Number, default: 0 },
  consumptionRate: { type: Number, default: 3000 },
  consumptionAmount: { type: Number, default: 1 },
  zeroSince: { type: Date, default: null },
  dead: { type: Boolean, default: false }, 
});

export default mongoose.model('Colony', ColonySchema);

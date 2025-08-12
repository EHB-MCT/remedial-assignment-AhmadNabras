import mongoose from 'mongoose';

const colonySchema = new mongoose.Schema({
  name: { type: String, required: true },
  water: { type: Number, default: 0 },
  oxygen: { type: Number, default: 0 },
  energy: { type: Number, default: 0 },
  production: {
    water: { type: Number, default: 0 },
    oxygen: { type: Number, default: 0 },
    energy: { type: Number, default: 0 },
  },
  consumption: {
    water: { type: Number, default: 0 },
    oxygen: { type: Number, default: 0 },
    energy: { type: Number, default: 0 },
  },
}, { timestamps: true });

export default mongoose.model('Colony', colonySchema);

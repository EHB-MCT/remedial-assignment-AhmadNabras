import mongoose from 'mongoose';

const ColonySchema = new mongoose.Schema({
  name: { type: String, required: true },
  water: { type: Number, default: 0 },
  oxygen: { type: Number, default: 0 },
  energy: { type: Number, default: 0 },
  production: { type: String, enum: ['water', 'oxygen', 'energy'], required: true },
  consumptionRate: { type: Number, required: true }, // in milliseconds
  consumptionAmount: { type: Number, required: true } // amount to consume each cycle
});

export default mongoose.model('Colony', ColonySchema);

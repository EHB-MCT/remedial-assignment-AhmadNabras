import mongoose from 'mongoose';

const ColonySchema = new mongoose.Schema({
  name: { type: String, required: true },
  water: { type: Number, default: 0, min: 0, max: 50 },
  oxygen: { type: Number, default: 0, min: 0, max: 50 },
  energy: { type: Number, default: 0, min: 0, max: 50 },
  production: {
    type: String,
    enum: ['water', 'oxygen', 'energy'],
    required: true
  },
  productionAmount: { type: Number, default: 0, min: 0, max: 50 }, 
  consumptionRate: { type: Number, default: 3000 }, 
  consumptionAmount: { type: Number, default: 1 },

  // ✅ Dead colony tracking
  dead: { type: Boolean, default: false },
  deadSince: { type: Date, default: null }
});

export default mongoose.model('Colony', ColonySchema);

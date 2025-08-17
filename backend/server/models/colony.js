import mongoose from "mongoose";

const ColonySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    water: { type: Number, default: 0, min: 0, max: 50 },
    oxygen: { type: Number, default: 0, min: 0, max: 50 },
    energy: { type: Number, default: 0, min: 0, max: 50 },
    production: {
      type: String,
      enum: ["water", "oxygen", "energy"],
      required: true,
    },
    productionAmount: { type: Number, default: 0, min: 0, max: 50 },
    consumptionRate: { type: Number, default: 3000 },
    consumptionAmount: { type: Number, default: 1 },
    dead: { type: Boolean, default: false },
    deadSince: { type: Date, default: null },

    // ✅ Counters for accurate reporting
    totalWaterUsed: { type: Number, default: 0 },
    totalOxygenUsed: { type: Number, default: 0 },
    totalEnergyUsed: { type: Number, default: 0 },
    totalProduced: { type: Number, default: 0 },

    history: [
      {
        timestamp: { type: Date, default: Date.now },
        water: Number,
        oxygen: Number,
        energy: Number,
        production: Number,
        dead: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true } // adds createdAt + updatedAt
);

export default mongoose.model("Colony", ColonySchema);

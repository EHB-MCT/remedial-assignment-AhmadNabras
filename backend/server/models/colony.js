import mongoose from "mongoose";

const colonySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    water: { type: Number, default: 0 },
    oxygen: { type: Number, default: 0 },
    energy: { type: Number, default: 0 },
    production: { type: String, required: true }, // "water" | "oxygen" | "energy"
    productionAmount: { type: Number, default: 0 },

    // Cumulative counters for reports
    totalWaterUsed: { type: Number, default: 0 },
    totalOxygenUsed: { type: Number, default: 0 },
    totalEnergyUsed: { type: Number, default: 0 },
    totalProduced: { type: Number, default: 0 },

    // Dead state
    dead: { type: Boolean, default: false },
    deadSince: { type: Date, default: null },

    // History snapshots
    history: [
      {
        timestamp: { type: Date, default: Date.now },
        water: Number,
        oxygen: Number,
        energy: Number,
        production: Number,
        dead: Boolean,
      },
    ],

    // Transfer log
    transfers: [
      {
        toColonyId: { type: mongoose.Schema.Types.ObjectId, ref: "Colony" },
        toColonyName: String,
        resource: String,
        amount: Number,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Colony", colonySchema);

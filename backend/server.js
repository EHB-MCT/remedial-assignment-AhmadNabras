// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import colonyRoutes from "./server/routes/colony-routes.js";
import Colony from "./server/models/Colony.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/colonies", colonyRoutes);

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("❌ Missing MONGO_URI in .env");
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ MongoDB connected");

    startRandomSeedDepletion();

    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

function startRandomSeedDepletion() {
  setInterval(async () => {
    try {
      const colonies = await Colony.find();

      colonies.forEach(async (colony) => {
        if (colony.dead) return;

        const randomDelay =
          Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
        const randomAmount = Math.floor(Math.random() * 5) + 1;

        setTimeout(async () => {
          // ✅ Track usage
          if (colony.water > 0) {
            const before = colony.water;
            colony.water = Math.max(0, colony.water - randomAmount);
            colony.totalWaterUsed += before - colony.water;
          }
          if (colony.oxygen > 0) {
            const before = colony.oxygen;
            colony.oxygen = Math.max(0, colony.oxygen - randomAmount);
            colony.totalOxygenUsed += before - colony.oxygen;
          }
          if (colony.energy > 0) {
            const before = colony.energy;
            colony.energy = Math.max(0, colony.energy - randomAmount);
            colony.totalEnergyUsed += before - colony.energy;
          }

          // ✅ Production increases productionAmount only
          if (colony.productionAmount < 50) {
            const produceAmount = Math.floor(Math.random() * 3) + 1;
            colony.productionAmount = Math.min(
              50,
              colony.productionAmount + produceAmount
            );
            colony.totalProduced += produceAmount;
          }

          // ✅ Death check
          if (
            colony.water === 0 ||
            colony.oxygen === 0 ||
            colony.energy === 0
          ) {
            if (!colony.deadSince) {
              colony.deadSince = Date.now();
            } else if (Date.now() - colony.deadSince > 10000) {
              colony.dead = true;
              console.log(`☠ Colony "${colony.name}" has died`);
            }
          } else {
            colony.deadSince = null;
          }

          // ✅ Save snapshot in history
          colony.history.push({
            timestamp: new Date(),
            water: colony.water,
            oxygen: colony.oxygen,
            energy: colony.energy,
            production: colony.productionAmount,
            dead: colony.dead,
          });

          await colony.save();
        }, randomDelay);
      });
    } catch (error) {
      console.error("Error during seed depletion/production:", error);
    }
  }, 6000);
}

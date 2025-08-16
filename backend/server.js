// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import colonyRoutes from './server/routes/colony-routes.js';
import Colony from './server/models/Colony.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/colonies', colonyRoutes);

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('❌ Missing MONGO_URI in .env');
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => {
    console.log('✅ MongoDB connected');
    startRandomSeedDepletion();
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

/**
 * Random Seed Depletion & Production
 */
function startRandomSeedDepletion() {
  setInterval(async () => {
    try {
      const colonies = await Colony.find();

      for (let colony of colonies) {
        if (colony.dead) continue; // ✅ DEAD colonies stop everything

        // Random resource depletion
        const randomAmount = Math.floor(Math.random() * 3) + 1;
        const resources = ['water', 'oxygen', 'energy'];
        const randomResource =
          resources[Math.floor(Math.random() * resources.length)];

        if (colony[randomResource] > 0) {
          colony[randomResource] = Math.max(
            0,
            colony[randomResource] - randomAmount
          );
        }

        // Increase storage (NOT auto-use)
        const produceAmount = Math.floor(Math.random() * 3) + 1;
        colony.productionStorage = (colony.productionStorage || 0) + produceAmount;
        colony.productionAmount = (colony.productionAmount || 0) + produceAmount;

        // Death condition: 10s without any resource
        if (colony.water === 0 || colony.oxygen === 0 || colony.energy === 0) {
          if (!colony.zeroSince) {
            colony.zeroSince = Date.now();
          } else if (Date.now() - colony.zeroSince > 10000) {
            colony.dead = true;
            console.log(`💀 Colony "${colony.name}" has died`);
          }
        } else {
          colony.zeroSince = null;
        }

        await colony.save();
      }
    } catch (error) {
      console.error('Error during seed depletion:', error);
    }
  }, 5000);
}

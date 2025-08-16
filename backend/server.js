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
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

/**
 * Colony depletion + production loop
 */
function startRandomSeedDepletion() {
  setInterval(async () => {
    try {
      const colonies = await Colony.find();

      colonies.forEach(async (colony) => {
        if (colony.isDead) return;

        const randomDelay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
        const randomAmount = Math.floor(Math.random() * 5) + 1;

        setTimeout(async () => {
          // Resource depletion
          if (colony.water > 0) {
            colony.water = Math.max(0, colony.water - randomAmount);
          }
          if (colony.oxygen > 0) {
            colony.oxygen = Math.max(0, colony.oxygen - randomAmount);
          }
          if (colony.energy > 0) {
            colony.energy = Math.max(0, colony.energy - randomAmount);
          }

          // Mark colony dead if 0 resource for >10s
          if (colony.water === 0 || colony.oxygen === 0 || colony.energy === 0) {
            if (!colony.deadSince) {
              colony.deadSince = new Date();
            } else {
              const elapsed = (new Date() - colony.deadSince) / 1000;
              if (elapsed >= 10) {
                colony.isDead = true;
                console.log(`☠️ Colony "${colony.name}" has died`);
              }
            }
          } else {
            colony.deadSince = null;
          }

          // ✅ Add to storage, not main resource
          const produceAmount = Math.floor(Math.random() * 3) + 1;
          colony.productionAmount = (colony.productionAmount || 0) + produceAmount;

          await colony.save();
        }, randomDelay);
      });
    } catch (error) {
      console.error('Error during colony update:', error);
    }
  }, 6000);
}

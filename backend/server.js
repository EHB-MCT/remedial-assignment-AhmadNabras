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
          if (colony.water > 0) {
            colony.water = Math.max(0, colony.water - randomAmount);
          }
          if (colony.oxygen > 0) {
            colony.oxygen = Math.max(0, colony.oxygen - randomAmount);
          }
          if (colony.energy > 0) {
            colony.energy = Math.max(0, colony.energy - randomAmount);
          }

          if (colony.productionAmount < 50) {
            const produceAmount = Math.floor(Math.random() * 3) + 1;
            colony.productionAmount = Math.min(
              50,
              colony.productionAmount + produceAmount
            );
            colony[colony.production] = Math.min(
              50,
              colony[colony.production] + produceAmount
            );
          }

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
      console.error('Error during seed depletion/production:', error);
    }
  }, 6000);
}

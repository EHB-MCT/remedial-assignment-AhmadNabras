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

    // Start the resource management loop after DB connection
    startResourceManagement();

    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });


function startResourceManagement() {
  setInterval(async () => {
    try {
      const colonies = await Colony.find();

      for (let colony of colonies) {
        if (colony.isDead) continue; // Skip dead colonies

        // Random delay
        const randomDelay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
        const randomAmount = Math.floor(Math.random() * 5) + 1;

        setTimeout(async () => {
          let updated = false;

          // 🔹 Resource consumption
          ['water', 'oxygen', 'energy'].forEach((resource) => {
            if (colony[resource] > 0 && resource !== colony.production) {
              colony[resource] = Math.max(0, colony[resource] - randomAmount);
              updated = true;
            }
          });

          // 🔹 Resource production
          const produceAmount = Math.floor(Math.random() * 3) + 1;
          colony[colony.production] += produceAmount;
          colony.productionAmount = (colony.productionAmount || 0) + produceAmount;
          updated = true;

          // 🔹 Starvation check
          const starving = (colony.water === 0 || colony.oxygen === 0 || colony.energy === 0);

          if (starving) {
            if (!colony.lastStarvedAt) {
              colony.lastStarvedAt = new Date(); // first time starving
            } else {
              const diff = Date.now() - new Date(colony.lastStarvedAt).getTime();
              if (diff >= 10000) {
                colony.isDead = true;
                console.log(`☠ Colony "${colony.name}" has died (starvation).`);
              }
            }
          } else {
            // reset starvation if resources recovered
            colony.lastStarvedAt = null;
          }

          if (updated) {
            await colony.save();
          }
        }, randomDelay);
      }
    } catch (error) {
      console.error('❌ Error during resource management:', error);
    }
  }, 6000); // run every 6 seconds
}

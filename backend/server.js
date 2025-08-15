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

    // Start the random depletion + production process
    startRandomSeedDepletion();

    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

/**
 * Step 1: Random Seed Depletion + Production Increment
 */
function startRandomSeedDepletion() {
  setInterval(async () => {
    try {
      const colonies = await Colony.find();

      for (let colony of colonies) {
        // Random delay between 2s and 5s
        const randomDelay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;

        setTimeout(async () => {
          // 🔹 Randomly consume resources (not the one being produced)
          const resources = ['water', 'oxygen', 'energy'].filter(r => r !== colony.production);
          const randomResource = resources[Math.floor(Math.random() * resources.length)];
          const consumeAmount = Math.floor(Math.random() * 3) + 1;

          if (colony[randomResource] > 0) {
            colony[randomResource] = Math.max(0, colony[randomResource] - consumeAmount);
          }

          // 🔹 Increase production resource & productionAmount
          const produceAmount = Math.floor(Math.random() * 3) + 1;
          colony[colony.production] += produceAmount;
          colony.productionAmount = (colony.productionAmount || 0) + produceAmount;

          await colony.save();
          console.log(`✅ Colony "${colony.name}" +${produceAmount} ${colony.production}, -${consumeAmount} ${randomResource}`);
        }, randomDelay);
      }
    } catch (error) {
      console.error('Error during seed depletion/production:', error);
    }
  }, 6000); // Every 6s start a new round
}

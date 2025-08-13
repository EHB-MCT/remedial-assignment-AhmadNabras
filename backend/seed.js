// backend/seed.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Colony from './server/models/colony.js';

dotenv.config();

const data = [
  {
    name: 'Alpha',
    water: 120, oxygen: 110, energy: 90,
    production: { water: 5, oxygen: 4, energy: 6 },
    consumption: { water: 3, oxygen: 3, energy: 4 }
  },
  {
    name: 'Beta',
    water: 95, oxygen: 140, energy: 70,
    production: { water: 2, oxygen: 6, energy: 3 },
    consumption: { water: 4, oxygen: 2, energy: 5 }
  },
  {
    name: 'Gamma',
    water: 105, oxygen: 100, energy: 120,
    production: { water: 3, oxygen: 5, energy: 4 },
    consumption: { water: 2, oxygen: 4, energy: 2 }
  }
];

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ Missing MONGO_URI in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');

    await Colony.deleteMany({});
    console.log('🧹 Cleared colonies collection');

    const inserted = await Colony.insertMany(data);
    console.log(`🌱 Seeded ${inserted.length} colonies`);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
    process.exit(0);
  }
}

run();

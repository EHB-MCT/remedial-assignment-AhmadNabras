import express from 'express';
import Colony from '../models/colony.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, water, oxygen, energy, production } = req.body;

    // Validate required fields
    if (!name || !production) {
      return res.status(400).json({ error: 'Name and production type are required' });
    }

    // Limit to 5 colonies
    const count = await Colony.countDocuments();
    if (count >= 5) {
      return res.status(400).json({ error: 'Maximum of 5 colonies allowed' });
    }

    // Random consumption values
    const consumptionRate = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
    const consumptionAmount = Math.floor(Math.random() * 5) + 1;

    const colony = new Colony({
      name,
      water: water || 0,
      oxygen: oxygen || 0,
      energy: energy || 0,
      production,
      consumptionRate,
      consumptionAmount
    });

    await colony.save();
    res.status(201).json(colony);
  } catch (err) {
    console.error('Error creating colony:', err);
    res.status(500).json({ error: 'Server error creating colony' });
  }
});

export default router;

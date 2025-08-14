import express from 'express';
import Colony from '../models/Colony.js';

const router = express.Router();

// Create a new colony
router.post('/', async (req, res) => {
  try {
    const { name, resourceType, seeds } = req.body;

    // 1️⃣ Limit colonies to max 5
    const totalColonies = await Colony.countDocuments();
    if (totalColonies >= 5) {
      return res.status(400).json({ message: 'You can only create up to 5 colonies.' });
    }

    // 2️⃣ Assign a random depletion rate between 1–5 seconds
    const randomDepletionRate = Math.floor(Math.random() * 5) + 1; // seconds

    // 3️⃣ Create the new colony
    const colony = new Colony({
      name,
      resourceType,
      seeds,
      depletionRate: randomDepletionRate
    });

    await colony.save();

    res.status(201).json(colony);
  } catch (error) {
    console.error('Error creating colony:', error);
    res.status(500).json({ message: 'Server error creating colony' });
  }
});

export default router;

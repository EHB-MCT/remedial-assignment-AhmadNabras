import express from 'express';
import Colony from '../models/Colony.js';

const router = express.Router();

// Create colony
router.post('/', async (req, res) => {
  try {
    const { name, water, oxygen, energy, production } = req.body;

    if (!name || !production) {
      return res.status(400).json({ error: 'Name and production type are required' });
    }

    const count = await Colony.countDocuments();
    if (count >= 5) {
      return res.status(400).json({ error: 'Maximum of 5 colonies allowed' });
    }

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

// Get all colonies
router.get('/', async (req, res) => {
  try {
    const colonies = await Colony.find();
    res.json(colonies);
  } catch (err) {
    console.error('Error fetching colonies:', err);
    res.status(500).json({ error: 'Server error fetching colonies' });
  }
});

// Delete colony
router.delete('/:id', async (req, res) => {
  try {
    const colony = await Colony.findByIdAndDelete(req.params.id);
    if (!colony) {
      return res.status(404).json({ error: 'Colony not found' });
    }
    res.json({ message: 'Colony deleted successfully' });
  } catch (err) {
    console.error('Error deleting colony:', err);
    res.status(500).json({ error: 'Server error deleting colony' });
  }
});

export default router;

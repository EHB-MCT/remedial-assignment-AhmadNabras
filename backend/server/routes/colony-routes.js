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
      productionAmount: 0,
      consumptionRate,
      consumptionAmount,
      dead: false
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

// Delete all colonies (restart game)
router.delete('/', async (req, res) => {
  try {
    await Colony.deleteMany({});
    res.json({ message: 'All colonies deleted successfully' });
  } catch (err) {
    console.error('Error deleting all colonies:', err);
    res.status(500).json({ error: 'Server error deleting all colonies' });
  }
});

// Transfer resources between colonies
router.post('/transfer', async (req, res) => {
  try {
    const { fromColonyId, toColonyId, resource, amount } = req.body;

    if (!fromColonyId || !toColonyId || !resource || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const fromColony = await Colony.findById(fromColonyId);
    const toColony = await Colony.findById(toColonyId);

    if (!fromColony || !toColony) {
      return res.status(404).json({ error: 'Colony not found' });
    }

    if (fromColony.productionAmount < amount) {
      return res.status(400).json({ error: 'Not enough production available' });
    }

    // Deduct from storage (productionAmount)
    fromColony.productionAmount -= amount;
    await fromColony.save();

    // Add to target colony seeds
    toColony[resource] += amount;
    await toColony.save();

    res.json({ message: `Transferred ${amount} ${resource} from ${fromColony.name} to ${toColony.name}` });
  } catch (err) {
    console.error('Error transferring resources:', err);
    res.status(500).json({ error: 'Server error transferring resources' });
  }
});

export default router;

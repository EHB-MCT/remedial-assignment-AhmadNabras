import { Router } from 'express';
import Colony from '../models/colony.js'; // include .js

const router = Router();

// GET all colonies
router.get('/', async (req, res) => {
  try {
    const colonies = await Colony.find();
    res.json(colonies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch colonies' });
  }
});

// POST new colony
router.post('/', async (req, res) => {
  try {
    const newColony = new Colony(req.body);
    const saved = await newColony.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create colony' });
  }
});

// PATCH update colony
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Colony.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update colony' });
  }
});

export default router;

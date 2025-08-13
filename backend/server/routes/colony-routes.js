import { Router } from 'express';
import Colony from '../models/Colony.js'; // Keep capital C for consistency

const router = Router();

/**
 * @route   GET /api/colonies
 * @desc    Get all colonies
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const colonies = await Colony.find();
    res.status(200).json(colonies);
  } catch (err) {
    console.error('❌ Failed to fetch colonies:', err.message);
    res.status(500).json({ error: 'Failed to fetch colonies' });
  }
});

/**
 * @route   POST /api/colonies
 * @desc    Create a new colony
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const newColony = new Colony(req.body);
    const saved = await newColony.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Failed to create colony:', err.message);
    res.status(400).json({ error: 'Failed to create colony' });
  }
});

/**
 * @route   PATCH /api/colonies/:id
 * @desc    Update an existing colony
 * @access  Public
 */
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Colony.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Colony not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('❌ Failed to update colony:', err.message);
    res.status(400).json({ error: 'Failed to update colony' });
  }
});

export default router;

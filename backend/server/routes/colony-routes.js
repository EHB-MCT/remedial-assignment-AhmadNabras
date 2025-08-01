// backend/routes/ColonyRoutes.js
const express = require('express');
const router = express.Router();
const Colony = require('../models/colony'); // ✅ Updated path from root of backend

// GET all colonies
router.get('/', async (req, res) => {
  const colonies = await Colony.find();
  res.json(colonies);
});

// POST new colony
router.post('/', async (req, res) => {
  const newColony = new Colony(req.body);
  const saved = await newColony.save();
  res.json(saved);
});

// PATCH update colony
router.patch('/:id', async (req, res) => {
  const updated = await Colony.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

module.exports = router;

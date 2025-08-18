import Colony from '../models/Colony.js';

// @desc    Get all colonies
// @route   GET /api/colonies
// @access  Public
export const getColonies = async (req, res) => {
  try {
    const colonies = await Colony.find();
    res.status(200).json(colonies);
  } catch (error) {
    console.error('❌ Error fetching colonies:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

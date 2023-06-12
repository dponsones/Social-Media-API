const Thought = require('../models/Thought');
const User = require('../models/User');

// GET all thoughts
const getAllThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find().populate('reactions');
    res.json(thoughts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get thoughts' });
  }
};

// GET a single thought by _id
const getThoughtById = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id).populate('reactions');
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get thought' });
  }
};

// POST a new thought
const createThought = async (req, res) => {
  try {
    const { thoughtText, username, userId } = req.body;

    // Create the new thought
    const newThought = await Thought.create({ thoughtText, username });

    // Update the associated user's thoughts array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { thoughts: newThought._id } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(201).json(newThought);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create thought' });
  }
};

// PUT to update a thought by _id
const updateThought = async (req, res) => {
  try {
    const { id } = req.params;
    const { thoughtText } = req.body;

    // Update the thought
    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      { thoughtText },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    res.json(updatedThought);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update thought' });
  }
};

// DELETE to remove a thought by _id
const deleteThought = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the thought and remove it
    const deletedThought = await Thought.findByIdAndRemove(id);

    if (!deletedThought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    // Remove the thought from the associated user's thoughts array
    const updatedUser = await User.findByIdAndUpdate(
      deletedThought.userId,
      { $pull: { thoughts: id } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Thought deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete thought' });
  }
};
const createReaction = async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body;

    // Find the thought and add the reaction to its reactions array
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $push: { reactions: { reactionBody, username } } },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    res.status(201).json(updatedThought);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create reaction' });
  }
};

// DELETE to pull and remove a reaction by the reaction's reactionId value
const deleteReaction = async (req, res) => {
  try {
    const { thoughtId, reactionId } = req.params;

    // Find the thought and pull/remove the reaction from its reactions array
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $pull: { reactions: { _id: reactionId } } },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    res.json(updatedThought);
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete reaction' });
  }
};
module.exports = {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction
};

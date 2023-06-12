const mongoose = require('mongoose');

// Reaction schema
const reactionSchema = new mongoose.Schema({
  // Define properties for the reaction schema
  // ...

  // For example:
  reactionText: {
    type: String,
    required: true,
  },
});

// Thought schema
const thoughtSchema = new mongoose.Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [reactionSchema],
});

// Virtual property for reactionCount
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

// Getter method to format the createdAt timestamp
thoughtSchema.path('createdAt').get(function (value) {
  return moment(value).format('M/D/YYYY, h:mm:ss A'); 
});


const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;

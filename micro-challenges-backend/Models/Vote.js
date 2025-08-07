const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  poll: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Poll",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  optionIndex: Number // ex: 0 pour la 1re option
});

module.exports = mongoose.model("Vote", voteSchema);

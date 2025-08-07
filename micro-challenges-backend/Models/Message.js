
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
 group: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Group",
  required: true
},

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: { type: String },
 
});

module.exports = mongoose.models.Message || mongoose.model("Message", messageSchema);


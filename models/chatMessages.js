const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  message: { type: String, required: true },
  direction: { type: String, enum: ["incoming", "outgoing"], required: false },
  sender: { type: String, required: true },
});

const chatMessagesSchema = new mongoose.Schema({
  chatMessages: [chatSchema],
  preSurveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PreSurvey",
    required: true,
  },
  task: { type: Number, required: true },
  round: { type: Number, default: null }, // null for Task 1
  level: {
    type: String,
    enum: ["low", "medium", "high"],
    required: function () {
      return this.task > 1; // only required for tasks 2–4
    },
  },
});

const ChatMessages = mongoose.model("ChatMessages", chatMessagesSchema);

module.exports = ChatMessages;

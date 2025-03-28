const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  message: { type: String, required: true },
  direction: { type: String, enum: ["incoming", "outgoing"], required: false },
  sender: { type: String, required: true },
});

const chatMessagesSchema = new mongoose.Schema({
  chatMessages: [chatSchema], // This defines `useCases` as an array of UseCaseSchema
  preSurveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PreSurvey",
    required: true,
  },
  task: Number,
});

const chatmessages = mongoose.model("chatmessages", chatMessagesSchema);

module.exports = chatmessages;

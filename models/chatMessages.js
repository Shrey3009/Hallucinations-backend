const mongoose = require("mongoose");

const chahtSchema = new mongoose.Schema({
  message: { type: String },
  direction: { type: String },
  sender: { type: String },
});

const chatMessagesSchema = new mongoose.Schema({
  chatMessages: [chahtSchema], // This defines `useCases` as an array of UseCaseSchema
  preSurveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PreSurvey",
    required: true,
  },
  task: Number,
});

const chatmessages = mongoose.model("chatmessages", chatMessagesSchema);

module.exports = chatmessages;

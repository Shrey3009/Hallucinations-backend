const mongoose = require("mongoose");

const UseCaseSchema = new mongoose.Schema({
  use: { type: String },
  explanation: { type: String },
});

const AUTSchema = new mongoose.Schema({
  useCases: [UseCaseSchema], // This defines `useCases` as an array of UseCaseSchema
  round: Number,
  preSurveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PreSurvey",
    required: true,
  },
  object: String,
  temperature: Number,
});

const AUT_gpt = mongoose.model("AUT_gpt", AUTSchema);

module.exports = AUT_gpt;

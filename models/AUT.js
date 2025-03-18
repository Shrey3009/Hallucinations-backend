const mongoose = require("mongoose");

const UseCaseSchema = new mongoose.Schema({
  use: { type: String },
  explanation: { type: String },
});

const AUTSchema = new mongoose.Schema({
  useCases: [UseCaseSchema], // This defines `useCases` as an array of UseCaseSchema
  preSurveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PreSurvey",
    required: true,
  },
});

const AUT = mongoose.model("AUT", AUTSchema);

module.exports = AUT;

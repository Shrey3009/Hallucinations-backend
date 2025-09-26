const mongoose = require("mongoose");

const PostSurveySchema = new mongoose.Schema({
  accuracy: { type: String, required: true },      // Q1
  helpfulness: { type: String, required: true },   // Q2
  inspiration: { type: String, required: true },   // Q3
  expansion: { type: String, required: true },     // Q4
  recombination: { type: String, required: true }, // Q5
  problems: { type: String, required: false },      // Q6
  improvements: { type: String, required: false },  // Q7
  agreeToTerms: { type: Boolean, required: false }, // Consent checkbox
  preSurveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PreSurvey",
    required: true,
  },
});

const PostSurvey = mongoose.model("PostSurvey", PostSurveySchema);

module.exports = PostSurvey;

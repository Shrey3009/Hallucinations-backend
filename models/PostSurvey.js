const mongoose = require("mongoose");

const PostSurveySchema = new mongoose.Schema({
  enjoyment: { type: String, required: true },
  difficulty: { type: String, required: true },
  aiHelpfulness: { type: String, required: true },
  aiInteraction: { type: String, required: true },
  creativity: { type: String, required: true },
  feedback: { type: String, required: true },
  improvements: { type: String, required: true },
  agreeToTerms: { type: Boolean, required: true },
  preSurveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PreSurvey",
    required: true,
  },
});

const PostSurvey = mongoose.model("PostSurvey", PostSurveySchema);

module.exports = PostSurvey;

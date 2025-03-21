const mongoose = require("mongoose");

const PreSurveySchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  email: { type: String, required: true, unique: true },
  gender: String,
  major: String,
  experience: String,
  activities: String,
  creativity: String,
  familiarity: String,
  agreeToTerms: Boolean,
});

const PreSurvey = mongoose.model("PreSurvey", PreSurveySchema);

module.exports = PreSurvey;

const mongoose = require("mongoose");

const PreSurveySchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  email: { type: String, required: true, unique: true },
  gender: String,
  address: String,
});

const PreSurvey = mongoose.model("PreSurvey", PreSurveySchema);

module.exports = PreSurvey;

const mongoose = require("mongoose");

const PostSurveySchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  email: { type: String, required: true, unique: true },
  gender: String,
  address: String,
});

const PostSurvey = mongoose.model("PostSurvey", PostSurveySchema);

module.exports = PostSurvey;

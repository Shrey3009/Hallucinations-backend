const mongoose = require("mongoose");

const PreSurveySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [1, "Age must be at least 1"],
      max: [120, "Age must be less than 120"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female", "other"],
    },
    major: {
      type: String,
      required: [true, "Major is required"],
      trim: true,
    },
    race: {
      type: String,
      required: [true, "Race is required"],
      trim: true,
    },
    experience: {
      type: String,
      required: [true, "AI experience is required"],
      enum: ["none", "Beginner", "Intermediate", "Advanced"],
    },
    activities: {
      type: String,
      required: [true, "Creative activities frequency is required"],
      enum: ["Never", "Rarely", "Sometimes", "Often"],
    },
    creativity: {
      type: String,
      required: [true, "Creativity rating is required"],
      enum: ["1", "2", "3", "4", "5"],
    },
    familiarity: {
      type: String,
      required: [true, "Familiarity rating is required"],
      enum: ["1", "2", "3", "4", "5"],
    },
    agreeToTerms: {
      type: Boolean,
      required: [true, "You must agree to the terms and conditions"],
      validate: {
        validator: function (v) {
          return v === true;
        },
        message: "You must agree to the terms and conditions",
      },
    },
  },
  {
    timestamps: true,
  }
);

const PreSurvey = mongoose.model("PreSurvey", PreSurveySchema);

module.exports = PreSurvey;

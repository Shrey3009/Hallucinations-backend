const mongoose = require("mongoose");

const PatentSelectionSchema = new mongoose.Schema(
  {
    preSurveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PreSurvey",
      required: true,
    },
    task1Patent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patent",
      required: true,
    },
    task2Patent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patent",
      required: true,
    },
    task3Patent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patent",
      required: true,
    },
    task4Patent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patent",
      required: true,
    },

    task2Category: { type: String, required: true },
    task3Category: { type: String, required: true },
    task4Category: { type: String, required: true },

    task2Level: { type: String, enum: ["low", "medium", "high"], required: true },
    task3Level: { type: String, enum: ["low", "medium", "high"], required: true },
    task4Level: { type: String, enum: ["low", "medium", "high"], required: true },
  },
  {
    timestamps: true,
  }
);

const PatentSelection = mongoose.model(
  "PatentSelection",
  PatentSelectionSchema
);

module.exports = PatentSelection;

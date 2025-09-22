const mongoose = require("mongoose");

const TaskPostSurveySchema = new mongoose.Schema(
  {
    // Task number to identify which task this survey is for
    taskNumber: {
      type: Number,
      required: [true, "Task number is required"],
      enum: [1, 2, 3, 4], // include Task 1 as baseline
    },

    // AI Suggestion Accuracy (for AI tasks: 2, 3, 4)
    aiAccuracy: {
      type: String,
      required: function () {
        return [2, 3, 4].includes(this.taskNumber);
      },
      enum: [
        "The suggestions were mostly incorrect or irrelevant",
        "Some suggestions made sense, but others seemed off",
        "The suggestions were generally reasonable and plausible",
        "Most suggestions were clear and accurate",
        "All suggestions were highly logical and well-grounded",
      ],
    },

    // AI Suggestion Helpfulness (for AI tasks: 2, 3, 4)
    aiHelpfulness: {
      type: String,
      required: function () {
        return [2, 3, 4].includes(this.taskNumber);
      },
      enum: [
        "Not helpful at all — I didn't use any of the AI suggestions",
        "Slightly helpful — One or two ideas gave me a small nudge",
        "Moderately helpful — The ideas helped me brainstorm better",
        "Very helpful — The suggestions pushed me in new directions",
        "Extremely helpful — The AI greatly enhanced my creativity",
      ],
    },

    // Confidence in ideas (for baseline task: 1)
    confidence: {
      type: String,
      required: function () {
        return this.taskNumber === 1;
      },
      enum: [
        "Not confident at all — My ideas were basic or unoriginal",
        "Slightly confident — I had some decent ideas but nothing special",
        "Moderately confident — My ideas were reasonably creative and useful",
        "Very confident — I came up with some innovative and practical ideas",
        "Extremely confident — My ideas were highly creative and groundbreaking",
      ],
    },

    // Task difficulty (for baseline task: 1)
    difficulty: {
      type: String,
      required: function () {
        return this.taskNumber === 1;
      },
      enum: [
        "Very easy — Ideas came to me naturally and quickly",
        "Somewhat easy — I could think of ideas without much struggle",
        "Moderate — Required some thinking but manageable",
        "Somewhat difficult — Had to work hard to come up with good ideas",
        "Very difficult — Struggled significantly to generate ideas",
      ],
    },

    // Reference to PreSurvey
    preSurveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PreSurvey",
      required: true,
    },
  },
  { timestamps: true }
);

const TaskPostSurvey = mongoose.model("TaskPostSurvey", TaskPostSurveySchema);

module.exports = TaskPostSurvey;

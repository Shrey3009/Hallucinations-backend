const mongoose = require("mongoose");

const PatentSchema = new mongoose.Schema(
  {
    categoryIndex: {
      type: Number,
      required: [true, "Category index is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Smart Interactive Beverage & Food Containers", "Healthcare", "Automation"],
      trim: true,
    },
    classifications: {
      type: String,
      required: [true, "Classifications are required"],
      trim: true,
    },
    patentName: {
      type: String,
      required: [true, "Patent name is required"],
      trim: true,
    },
    patentLink: {
      type: String,
      required: [true, "Patent link is required"],
      trim: true,
    },
    abstract: {
      type: String,
      required: [true, "Abstract is required"],
      trim: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["active", "pending", "abandoned", "expired"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    lowHallucinationExample: {
      type: String,
      trim: true,
    },
    mediumHallucinationExample: {
      type: String,
      trim: true,
    },
    highHallucinationExample: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Patent = mongoose.model("Patent", PatentSchema);

module.exports = Patent;

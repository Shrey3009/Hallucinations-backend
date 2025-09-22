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
    patentDescription: {
      type: String,
      required: [true, "Patent description is required"],
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
      default: "",
    },
    mediumHallucinationExample: {
      type: String,
      trim: true,
      default: "",
    },
    highHallucinationExample: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Patent = mongoose.model("Patent", PatentSchema);

module.exports = Patent;

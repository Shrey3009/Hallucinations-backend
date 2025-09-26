const express = require("express");
const PostSurvey_rec = require("../models/PostSurvey");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/PostSurvey", async (req, res) => {
  try {
    console.log("✅ PostSurvey submission received:", req.body);

    // Validate preSurveyId format
    if (!mongoose.Types.ObjectId.isValid(req.body.preSurveyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid PreSurvey ID format",
      });
    }

    // Explicitly cast preSurveyId to ObjectId
    const postSurvey = new PostSurvey_rec({
      ...req.body,
      preSurveyId: new mongoose.Types.ObjectId(req.body.preSurveyId),
    });

    // Run sync validation before saving
    const validationError = postSurvey.validateSync();
    if (validationError) {
      console.error("❌ Validation details (sync):", validationError.errors);
      const errors = Object.values(validationError.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    // Save the document (async validation also runs here)
    await postSurvey.save();

    res.status(201).json({
      success: true,
      message: "Survey submitted successfully",
      _id: postSurvey._id,
    });
  } catch (error) {
    console.error("❌ Error in PostSurvey submission:", error);

    if (error.name === "ValidationError") {
      console.error("❌ Validation details (catch):", error.errors);
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
      error: error.message,
    });
  }
});

module.exports = router;

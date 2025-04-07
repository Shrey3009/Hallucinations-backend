const express = require("express");
const PreSurvey_rec = require("../models/PreSurvey"); // Adjust the path as necessary
const router = express.Router();

router.post("/PreSurvey", async (req, res) => {
  try {
    console.log("PreSurvey submission received:", req.body);

    // Create a new PreSurvey document
    const preSurvey = new PreSurvey_rec(req.body);

    // Validate the document
    const validationError = preSurvey.validateSync();
    if (validationError) {
      const errors = Object.values(validationError.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    // Check for duplicate email
    const existingSurvey = await PreSurvey_rec.findOne({
      email: req.body.email,
    });
    if (existingSurvey) {
      return res.status(400).json({
        success: false,
        message: "A survey with this email already exists",
      });
    }

    // Save the document
    await preSurvey.save();

    res.status(201).json({
      success: true,
      message: "Survey submitted successfully",
      _id: preSurvey._id,
    });
  } catch (error) {
    console.error("Error in PreSurvey submission:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({
        success: false,
        message: "A survey with this email already exists",
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

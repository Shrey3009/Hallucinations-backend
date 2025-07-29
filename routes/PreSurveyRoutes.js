const express = require("express");
const PreSurvey_rec = require("../models/PreSurvey"); // Adjust the path as necessary
const router = express.Router();

router.post("/PreSurvey", async (req, res) => {
  try {
    console.log("PreSurvey submission received:", req.body);
    console.log("Request body keys:", Object.keys(req.body));
    console.log("Request body values:", Object.values(req.body));

    // Create a new PreSurvey document
    const preSurvey = new PreSurvey_rec(req.body);
    console.log("Created PreSurvey document:", preSurvey);

    // Validate the document
    const validationError = preSurvey.validateSync();
    if (validationError) {
      console.log("Validation errors found:", validationError.errors);
      const errors = Object.values(validationError.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    console.log("Validation passed, attempting to save...");
    // Save the document (removed email duplicate check since email field no longer exists)
    await preSurvey.save();
    console.log("PreSurvey saved successfully with ID:", preSurvey._id);

    res.status(201).json({
      success: true,
      message: "Survey submitted successfully",
      _id: preSurvey._id,
    });
  } catch (error) {
    console.error("Error in PreSurvey submission:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);

    if (error.name === "ValidationError") {
      console.log("Mongoose validation error details:", error.errors);
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

const express = require("express");
const AUT = require("../models/AUT"); // Ensure this path is correct
const router = express.Router();
const mongoose = require("mongoose");

router.post("/AUT", async (req, res) => {
  const { useCases, preSurveyId } = req.body;

  // Validate preSurveyId
  if (!mongoose.Types.ObjectId.isValid(preSurveyId)) {
    return res.status(400).send("Invalid PreSurvey ID format.");
  }

  try {
    console.log("AUT got hit", req.body); // Logging the event correctly
    // Create a new AUT document with an array of use cases and the preSurveyId
    const aut = new AUT({ useCases, preSurveyId });
    await aut.save();
    res.status(201).send(aut);
  } catch (error) {
    console.error("Error saving AUT:", error);
    res.status(500).send(error.message);
  }
});

module.exports = router;

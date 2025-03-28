const express = require("express");
const chatMessagesSchema = require("../models/chatMessages"); // Ensure this path is correct
const router = express.Router();
const mongoose = require("mongoose");

router.post("/chatbotmessages", async (req, res) => {
  const { preSurveyId, task, chatMessages } = req.body;

  // Validate preSurveyId
  if (!mongoose.Types.ObjectId.isValid(preSurveyId)) {
    return res.status(400).send("Invalid PreSurvey ID format.");
  }

  try {
    console.log("chatMessages got hit", req.body); // Logging the event correctly
    const chatMessagesModel = new chatMessagesSchema({
      task,
      chatMessages,
      preSurveyId,
    });
    await chatMessagesModel.save();
    res.status(201).send(chatMessagesModel);
  } catch (error) {
    console.error("Error saving chatMessages:", error);
    res.status(500).send(error.message);
  }
});

module.exports = router;

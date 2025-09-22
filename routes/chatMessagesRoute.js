// routes/chatMessagesRoute.js
const express = require("express");
const router = express.Router();

const ChatMessages = require("../models/chatMessages");       // <-- your path may differ
const PatentSelection = require("../models/PatentSelection"); // <-- your path may differ

// Create a chat-messages record with SERVER-ENFORCED level
router.post("/", async (req, res) => {
  try {
    const { preSurveyId, task, round, chatMessages } = req.body;

    // Basic validation
    if (!preSurveyId || typeof task === "undefined") {
      return res.status(400).json({ error: "preSurveyId and task are required" });
    }

    const taskNum = Number(task);

    // For tasks 2–4 we require a round (1 or 2)
    if (taskNum > 1 && (round === null || typeof round === "undefined")) {
      return res.status(400).json({ error: "round is required for tasks 2–4" });
    }

    // Always fetch the level from PatentSelection; never trust client body
    let enforcedLevel = undefined;

    if (taskNum > 1) {
      const mapping = await PatentSelection.findOne({ preSurveyId }).lean();
      if (!mapping) {
        return res.status(404).json({ error: "PatentSelection mapping not found for this preSurveyId" });
      }

      const levelField =
        taskNum === 2 ? "task2Level" :
        taskNum === 3 ? "task3Level" :
        taskNum === 4 ? "task4Level" : null;

      if (!levelField || !mapping[levelField]) {
        return res.status(400).json({ error: "Invalid task or level missing in PatentSelection" });
      }

      enforcedLevel = mapping[levelField]; // "low" | "medium" | "high"
    }

    // Persist using the enforcedLevel (or null for task 1)
    const doc = await ChatMessages.create({
      preSurveyId,
      task: taskNum,
      round: taskNum === 1 ? null : Number(round),
      level: taskNum === 1 ? undefined : enforcedLevel,
      chatMessages,
    });

    // Return the saved doc so the client can log the actual level used
    return res.status(201).json({ ok: true, saved: doc });
  } catch (err) {
    console.error("Failed to save chat messages:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

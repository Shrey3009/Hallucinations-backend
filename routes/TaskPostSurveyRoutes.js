const express = require("express");
const router = express.Router();
const TaskPostSurvey = require("../models/TaskPostSurvey");

// Create a new task post-survey
router.post("/", async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const {
      accuracy,
      helpfulness,
      confidence,
      difficulty,
      preSurveyId,
      taskNumber,
    } = req.body;

    console.log("Extracted fields:", {
      accuracy,
      helpfulness,
      confidence,
      difficulty,
      preSurveyId,
      taskNumber,
    });

    // Validate required fields based on task type
    if (!preSurveyId || !taskNumber) {
      return res.status(400).json({
        error: "preSurveyId and taskNumber are required",
      });
    }

   const isAITask = [2, 3, 4].includes(taskNumber);
   const isBaselineTask = taskNumber === 1;

    if (isAITask && (!accuracy || !helpfulness)) {
  return res.status(400).json({
    error: "For AI tasks (2, 3, 4), accuracy and helpfulness are required",
  });
}

    if (isBaselineTask && (!confidence || !difficulty)) {
  return res.status(400).json({
    error: "For baseline task (1), confidence and difficulty are required",
  });
}

    // Map frontend values to backend enum values
    const accuracyMap = {
      "mostly-incorrect": "The suggestions were mostly incorrect or irrelevant",
      "some-made-sense": "Some suggestions made sense, but others seemed off",
      "generally-reasonable":
        "The suggestions were generally reasonable and plausible",
      "mostly-clear-accurate": "Most suggestions were clear and accurate",
      "highly-logical": "All suggestions were highly logical and well-grounded",
    };

    const helpfulnessMap = {
      "not-helpful":
        "Not helpful at all — I didn't use any of the AI suggestions",
      "slightly-helpful":
        "Slightly helpful — One or two ideas gave me a small nudge",
      "moderately-helpful":
        "Moderately helpful — The ideas helped me brainstorm better",
      "very-helpful":
        "Very helpful — The suggestions pushed me in new directions",
      "extremely-helpful":
        "Extremely helpful — The AI greatly enhanced my creativity",
    };

    const confidenceMap = {
      "not-confident":
        "Not confident at all — My ideas were basic or unoriginal",
      "slightly-confident":
        "Slightly confident — I had some decent ideas but nothing special",
      "moderately-confident":
        "Moderately confident — My ideas were reasonably creative and useful",
      "very-confident":
        "Very confident — I came up with some innovative and practical ideas",
      "extremely-confident":
        "Extremely confident — My ideas were highly creative and groundbreaking",
    };

    const difficultyMap = {
      "very-easy": "Very easy — Ideas came to me naturally and quickly",
      "somewhat-easy":
        "Somewhat easy — I could think of ideas without much struggle",
      moderate: "Moderate — Required some thinking but manageable",
      "somewhat-difficult":
        "Somewhat difficult — Had to work hard to come up with good ideas",
      "very-difficult":
        "Very difficult — Struggled significantly to generate ideas",
    };

    // Build the survey data based on task type
    const surveyData = {
      taskNumber,
      preSurveyId,
    };

    if (isAITask) {
      surveyData.aiAccuracy = accuracyMap[accuracy];
      surveyData.aiHelpfulness = helpfulnessMap[helpfulness];
    }

    if (isBaselineTask) {
      surveyData.confidence = confidenceMap[confidence];
      surveyData.difficulty = difficultyMap[difficulty];
    }

    const taskPostSurvey = new TaskPostSurvey(surveyData);
    const savedTaskPostSurvey = await taskPostSurvey.save();

    res.status(201).json({
      message: "Task post-survey submitted successfully",
      data: savedTaskPostSurvey,
    });
  } catch (error) {
    console.error("Error creating task post-survey:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.message,
      });
    }

    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Get all task post-surveys
router.get("/", async (req, res) => {
  try {
    const taskPostSurveys = await TaskPostSurvey.find()
      .populate("preSurveyId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Task post-surveys retrieved successfully",
      data: taskPostSurveys,
    });
  } catch (error) {
    console.error("Error fetching task post-surveys:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Get a specific task post-survey by ID
router.get("/:id", async (req, res) => {
  try {
    const taskPostSurvey = await TaskPostSurvey.findById(
      req.params.id
    ).populate("preSurveyId");

    if (!taskPostSurvey) {
      return res.status(404).json({
        error: "Task post-survey not found",
      });
    }

    res.status(200).json({
      message: "Task post-survey retrieved successfully",
      data: taskPostSurvey,
    });
  } catch (error) {
    console.error("Error fetching task post-survey:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid task post-survey ID",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Get task post-surveys by preSurveyId
router.get("/by-presurvey/:preSurveyId", async (req, res) => {
  try {
    const taskPostSurveys = await TaskPostSurvey.find({
      preSurveyId: req.params.preSurveyId,
    }).populate("preSurveyId");

    res.status(200).json({
      message: "Task post-surveys retrieved successfully",
      data: taskPostSurveys,
    });
  } catch (error) {
    console.error("Error fetching task post-surveys by preSurveyId:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid preSurvey ID",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Update a task post-survey
router.put("/:id", async (req, res) => {
  try {
    const { aiAccuracy, aiHelpfulness } = req.body;

    const taskPostSurvey = await TaskPostSurvey.findByIdAndUpdate(
      req.params.id,
      { aiAccuracy, aiHelpfulness },
      { new: true, runValidators: true }
    ).populate("preSurveyId");

    if (!taskPostSurvey) {
      return res.status(404).json({
        error: "Task post-survey not found",
      });
    }

    res.status(200).json({
      message: "Task post-survey updated successfully",
      data: taskPostSurvey,
    });
  } catch (error) {
    console.error("Error updating task post-survey:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid task post-survey ID",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Delete a task post-survey
router.delete("/:id", async (req, res) => {
  try {
    const taskPostSurvey = await TaskPostSurvey.findByIdAndDelete(
      req.params.id
    );

    if (!taskPostSurvey) {
      return res.status(404).json({
        error: "Task post-survey not found",
      });
    }

    res.status(200).json({
      message: "Task post-survey deleted successfully",
      data: taskPostSurvey,
    });
  } catch (error) {
    console.error("Error deleting task post-survey:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid task post-survey ID",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

module.exports = router;

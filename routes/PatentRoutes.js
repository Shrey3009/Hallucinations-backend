// patentroutes.js
const express = require("express");
const router = express.Router();
const Patent = require("../models/Patent");
const PatentSelection = require("../models/PatentSelection");

// Get all patents
router.get("/patents", async (req, res) => {
  try {
    const patents = await Patent.find().sort({
      categoryIndex: 1,
      patentName: 1,
    });

    res.status(200).json({
      success: true,
      message: "Patents retrieved successfully",
      data: patents,
    });
  } catch (error) {
    console.error("Error fetching patents:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching patents",
      error: error.message,
    });
  }
});

// Get patents by category
router.get("/patents/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const patents = await Patent.find({ category });

    res.status(200).json({
      success: true,
      message: `Patents in ${category} category retrieved successfully`,
      data: patents,
    });
  } catch (error) {
    console.error("Error fetching patents by category:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching patents",
      error: error.message,
    });
  }
});

// Assign patents to a user (called when PreSurvey is submitted)
router.post("/patent-assignment", async (req, res) => {
  try {
    console.log("Incoming body for /patent-assignment:", req.body);
    const { preSurveyId } = req.body;

    if (!preSurveyId) {
      return res.status(400).json({
        success: false,
        message: "preSurveyId is required",
      });
    }

    // Check if already assigned
    const existingAssignment = await PatentSelection.findOne({ preSurveyId });
    if (existingAssignment) {
      return res.status(200).json({
        success: true,
        message: "Patents already assigned to this user",
        data: existingAssignment,
      });
    }

    // Get all patents
    const allPatents = await Patent.find();
    console.log("Total patents in DB:", allPatents.length);

    if (allPatents.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Not enough patents in database to assign",
      });
    }

    // ---- Task 1: Random patent from any category ----
    const task1Patent =
      allPatents[Math.floor(Math.random() * allPatents.length)];

    // ---- Tasks 2–4: Random patents from unique categories ----
    const categories = [
      "Smart Interactive Beverage & Food Containers",
      "Healthcare",
      "Automation",
    ];
    const shuffledCategories = categories.sort(() => Math.random() - 0.5);

    const [task2Category, task3Category, task4Category] = shuffledCategories;

    // helper: pick a random patent from a category, excluding certain IDs
    function getRandomPatentFromCategory(category, excludeIds = []) {
      const candidates = allPatents.filter(
        (p) =>
          p.category === category && !excludeIds.includes(p._id.toString())
      );
      if (candidates.length === 0) return null;
      return candidates[Math.floor(Math.random() * candidates.length)];
    }

    const task2Patent = getRandomPatentFromCategory(task2Category, [
      task1Patent._id.toString(),
    ]);
    const task3Patent = getRandomPatentFromCategory(task3Category, [
      task1Patent._id.toString(),
    ]);
    const task4Patent = getRandomPatentFromCategory(task4Category, [
      task1Patent._id.toString(),
    ]);

    if (!task2Patent || !task3Patent || !task4Patent) {
      return res.status(400).json({
        success: false,
        message: "Not enough patents in each category to assign unique patents",
      });
    }

    // ---- Randomize levels for tasks 2–4 ----
    function shuffleArray(array) {
      const newArr = [...array];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    }

    const shuffledLevels = shuffleArray(["low", "medium", "high"]);
    const [task2Level, task3Level, task4Level] = shuffledLevels;

    // ---- Save assignment ----
    const patentSelection = new PatentSelection({
      preSurveyId,
      task1Patent: task1Patent._id,
      task2Patent: task2Patent._id,
      task3Patent: task3Patent._id,
      task4Patent: task4Patent._id,
      task2Category,
      task3Category,
      task4Category,
      task2Level,
      task3Level,
      task4Level,
    });

    const savedSelection = await patentSelection.save();

    const populatedSelection = await PatentSelection.findById(
      savedSelection._id
    )
      .populate("task1Patent")
      .populate("task2Patent")
      .populate("task3Patent")
      .populate("task4Patent");

    res.status(201).json({
      success: true,
      message: "Patents assigned successfully",
      data: populatedSelection,
    });
  } catch (error) {
    console.error("Error assigning patents:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while assigning patents",
      error: error.message,
    });
  }
});

// Get assignment for a user
router.get("/patent-assignment/:preSurveyId", async (req, res) => {
  try {
    const { preSurveyId } = req.params;

    const assignment = await PatentSelection.findOne({ preSurveyId })
      .populate("task1Patent")
      .populate("task2Patent")
      .populate("task3Patent")
      .populate("task4Patent");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "No patent assignment found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Patent assignment retrieved successfully",
      data: assignment,
    });
  } catch (error) {
    console.error("Error fetching patent assignment:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching patent assignment",
      error: error.message,
    });
  }
});

// Get patent for specific task (with hallucination level)
router.get("/patent-for-task/:preSurveyId/:taskNumber", async (req, res) => {
  try {
    const { preSurveyId, taskNumber } = req.params;

    const assignment = await PatentSelection.findOne({ preSurveyId })
      .populate("task1Patent")
      .populate("task2Patent")
      .populate("task3Patent")
      .populate("task4Patent");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "No patent assignment found for this user",
      });
    }

    const taskMap = {
      1: assignment.task1Patent,
      2: assignment.task2Patent,
      3: assignment.task3Patent,
      4: assignment.task4Patent,
    };

    const levelMap = {
      2: assignment.task2Level,
      3: assignment.task3Level,
      4: assignment.task4Level,
    };

    const patent = taskMap[taskNumber];
    const level = levelMap[taskNumber] || null;

    if (!patent) {
      return res.status(400).json({
        success: false,
        message: "Invalid task number. Must be 1, 2, 3, or 4",
      });
    }

    res.status(200).json({
      success: true,
      message: `Patent for task ${taskNumber} retrieved successfully`,
      data: patent,
      level, // hallucination level for tasks 2–4
    });
  } catch (error) {
    console.error("Error fetching patent for task:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching patent for task",
      error: error.message,
    });
  }
});

module.exports = router;

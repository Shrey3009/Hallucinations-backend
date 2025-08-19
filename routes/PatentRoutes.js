const express = require("express");
const router = express.Router();
const Patent = require("../models/Patent");
const PatentSelection = require("../models/PatentSelection");

// Create/Import patents (for initial data setup)
router.post("/patents", async (req, res) => {
  try {
    const patent = new Patent(req.body);
    const savedPatent = await patent.save();
    
    res.status(201).json({
      success: true,
      message: "Patent created successfully",
      data: savedPatent,
    });
  } catch (error) {
    console.error("Error creating patent:", error);
    
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }
    
    res.status(500).json({
      success: false,
      message: "An error occurred while creating patent",
      error: error.message,
    });
  }
});

// Bulk import patents
router.post("/patents/bulk", async (req, res) => {
  try {
    const patents = req.body.patents; // Expecting an array of patent objects
    const savedPatents = await Patent.insertMany(patents);
    
    res.status(201).json({
      success: true,
      message: `${savedPatents.length} patents imported successfully`,
      data: savedPatents,
    });
  } catch (error) {
    console.error("Error bulk importing patents:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while importing patents",
      error: error.message,
    });
  }
});

// Get all patents
router.get("/patents", async (req, res) => {
  try {
    const patents = await Patent.find().sort({ categoryIndex: 1, patentName: 1 });
    
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
    const { preSurveyId } = req.body;
    
    if (!preSurveyId) {
      return res.status(400).json({
        success: false,
        message: "preSurveyId is required",
      });
    }

    // Check if patents already assigned to this user
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
    if (allPatents.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Not enough patents in database to assign",
      });
    }

    // Task 1: Random patent from entire database
    const task1Patent = allPatents[Math.floor(Math.random() * allPatents.length)];

    // Get patents by category for tasks 2, 3, 4
    const categories = ["Smart Interactive Beverage & Food Containers", "Healthcare", "Automation"];
    const shuffledCategories = categories.sort(() => Math.random() - 0.5);

    const task2Category = shuffledCategories[0];
    const task3Category = shuffledCategories[1];
    const task4Category = shuffledCategories[2];

    const task2Patents = allPatents.filter(p => p.category === task2Category && p._id.toString() !== task1Patent._id.toString());
    const task3Patents = allPatents.filter(p => p.category === task3Category && p._id.toString() !== task1Patent._id.toString());
    const task4Patents = allPatents.filter(p => p.category === task4Category && p._id.toString() !== task1Patent._id.toString());

    if (task2Patents.length === 0 || task3Patents.length === 0 || task4Patents.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Not enough patents in each category to assign unique patents",
      });
    }

    const task2Patent = task2Patents[Math.floor(Math.random() * task2Patents.length)];
    let task3Patent = task3Patents[Math.floor(Math.random() * task3Patents.length)];
    let task4Patent = task4Patents[Math.floor(Math.random() * task4Patents.length)];

    // Ensure no duplicates across tasks 2, 3, 4
    while (task3Patent._id.toString() === task2Patent._id.toString()) {
      task3Patent = task3Patents[Math.floor(Math.random() * task3Patents.length)];
    }
    
    while (task4Patent._id.toString() === task2Patent._id.toString() || 
           task4Patent._id.toString() === task3Patent._id.toString()) {
      task4Patent = task4Patents[Math.floor(Math.random() * task4Patents.length)];
    }

    // Save the assignment
    const patentSelection = new PatentSelection({
      preSurveyId,
      task1Patent: task1Patent._id,
      task2Patent: task2Patent._id,
      task3Patent: task3Patent._id,
      task4Patent: task4Patent._id,
      task2Category,
      task3Category,
      task4Category,
    });

    const savedSelection = await patentSelection.save();
    
    // Populate with patent details
    const populatedSelection = await PatentSelection.findById(savedSelection._id)
      .populate('task1Patent')
      .populate('task2Patent')
      .populate('task3Patent')
      .populate('task4Patent');

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

// Get patent assignment for a user
router.get("/patent-assignment/:preSurveyId", async (req, res) => {
  try {
    const { preSurveyId } = req.params;
    
    const assignment = await PatentSelection.findOne({ preSurveyId })
      .populate('task1Patent')
      .populate('task2Patent')
      .populate('task3Patent')
      .populate('task4Patent');
    
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

// Get specific patent for a task
router.get("/patent-for-task/:preSurveyId/:taskNumber", async (req, res) => {
  try {
    const { preSurveyId, taskNumber } = req.params;
    
    const assignment = await PatentSelection.findOne({ preSurveyId })
      .populate('task1Patent')
      .populate('task2Patent')
      .populate('task3Patent')
      .populate('task4Patent');
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "No patent assignment found for this user",
      });
    }
    
    let patent;
    switch (taskNumber) {
      case '1':
        patent = assignment.task1Patent;
        break;
      case '2':
        patent = assignment.task2Patent;
        break;
      case '3':
        patent = assignment.task3Patent;
        break;
      case '4':
        patent = assignment.task4Patent;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid task number. Must be 1, 2, 3, or 4",
        });
    }
    
    res.status(200).json({
      success: true,
      message: `Patent for task ${taskNumber} retrieved successfully`,
      data: patent,
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

const express = require("express");
const PreSurvey_rec = require("../models/PreSurvey"); // Adjust the path as necessary
const router = express.Router();

router.post("/PreSurvey", async (req, res) => {
  try {
    console.log("PreSurvey got hit", req.body); // Logging the event correctly
    // console.log("MONGO_URI : ", process.env.MONGO_URI);
    const PreSurvey = new PreSurvey_rec(req.body);
    await PreSurvey.save();
    res.status(201).send(PreSurvey);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

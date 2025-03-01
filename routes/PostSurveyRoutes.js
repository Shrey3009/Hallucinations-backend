const express = require("express");
const PostSurvey_rec = require("../models/PostSurvey"); // Adjust the path as necessary
const router = express.Router();

router.post("/PostSurvey", async (req, res) => {
  try {
    const PostSurvey = new PostSurvey_rec(req.body);
    await PostSurvey.save();
    res.status(201).send(PostSurvey);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

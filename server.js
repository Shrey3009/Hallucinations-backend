require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const PreSurvey = require("./routes/PreSurveyRoutes"); // Adjust the path as necessary
const PostSurvey = require("./routes/PostSurveyRoutes"); // Adjust the path as necessary
const AUT = require("./routes/AUTRoutes"); // Adjust the path as necessary
const AUT_gpt = require("./routes/AUT_gptRoutes"); // Adjust the path as necessary

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON bodies

const cors = require("cors");

// CORS configuration
// This sets up CORS to allow requests from your React application's domain
app.use(
  cors({
    origin: "http://localhost:5173", // Only allow this origin to access the resources
  })
);

app.use(PreSurvey); // Use the user routes
app.use(AUT);
app.use(AUT_gpt);
app.use(PostSurvey); // Use the user routes

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

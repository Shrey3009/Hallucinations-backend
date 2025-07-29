require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const PreSurvey = require("./routes/PreSurveyRoutes"); // Adjust the path as necessary
const PostSurvey = require("./routes/PostSurveyRoutes"); // Adjust the path as necessary
const AUT = require("./routes/AUTRoutes"); // Adjust the path as necessary
const AUT_gpt = require("./routes/AUT_gptRoutes"); // Adjust the path as necessary
const chatMessages = require("./routes/chatMessagesRoute"); // Adjust the path as necessary
const TaskPostSurveyRoutes = require("./routes/TaskPostSurveyRoutes"); // Adjust the path as necessary

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON bodies

const cors = require("cors");

app.use(
  cors({
    origin: true, // Allows all domains to access your resources
  })
);

// Middleware to log requests
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} request to ${req.url} from ${
      req.ip
    }`
  );
  // res.status(200).send("Welcome to the API!"); // Correct usage
  console.log("API got hit"); // Logging the event correctly
  next(); // Pass to next middleware or route handler
});

app.use(PreSurvey); // Use the user routes
app.use(AUT);
app.use(AUT_gpt);
app.use(PostSurvey); // Use the user routes
app.use(chatMessages);
app.use("/TaskPostSurvey", TaskPostSurveyRoutes); // Use the task post-survey routes

console.log("MONGO_URI : ", process.env.MONGO_URI);

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

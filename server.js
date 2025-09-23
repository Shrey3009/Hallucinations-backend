require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const PreSurvey = require("./routes/PreSurveyRoutes");
const PostSurvey = require("./routes/PostSurveyRoutes");
const AUT = require("./routes/AUTRoutes");
const AUT_gpt = require("./routes/AUT_gptRoutes");
const chatMessages = require("./routes/chatMessagesRoute");
const TaskPostSurveyRoutes = require("./routes/TaskPostSurveyRoutes");
const PatentRoutes = require("./routes/PatentRoutes");
const openaiRoute = require("./routes/OpenAiRoute");

const app = express();

// Middleware
app.use(express.json());
const cors = require("cors");
app.use(cors({ origin: true }));

// Logging
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} request to ${req.url} from ${req.ip}`
  );
  next();
});

// Routes
app.use("/api", PreSurvey);
app.use("/api", AUT);
app.use("/api", AUT_gpt);
app.use("/api", PostSurvey);
app.use("/api/chatbotmessages", chatMessages);
app.use("/api", TaskPostSurveyRoutes);
app.use("/api", PatentRoutes);
app.use("/api", openaiRoute);

console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Export for Vercel
module.exports = app;

// Start server (if running locally)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

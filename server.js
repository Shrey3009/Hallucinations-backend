require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db"); // <-- new helper

// Routes
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
app.use(cors({ origin: true }));

// Logging
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} request to ${req.url} from ${req.ip}`
  );
  next();
});

// Ensure DB connected before hitting routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection failed:", err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
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

// Debug route: test DB connection manually
app.get("/api/dbcheck", async (req, res) => {
  try {
    await connectDB();
    res.json({ status: "ok", message: "MongoDB connection successful" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Export for Vercel
module.exports = app;

// Local dev
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

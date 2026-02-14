import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import jobRoutes from "./routes/routes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { logger } from "./middleware/loggerMiddleware.js";
import { processQueue } from "./utils/queue.js";
import { initCronJobs } from "./utils/cronJobs.js";

dotenv.config();

const app = express();

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    success: false,
    message: 'Too many requests. Please try again after 15 minutes.'
  }
});

app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/api", limiter); 

connectDB();
processQueue();
initCronJobs();

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/jobs", jobRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

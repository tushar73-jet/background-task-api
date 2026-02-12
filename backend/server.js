import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import jobRoutes from "./routes/routes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { logger } from "./middleware/loggerMiddleware.js";
import { processQueue } from "./utils/queue.js";
import { initCronJobs } from "./utils/cronJobs.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(logger);

connectDB();
processQueue();
initCronJobs();

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/jobs", jobRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

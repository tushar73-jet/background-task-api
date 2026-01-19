import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import jobRoutes from "./routes/routes.js";

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Server is running");
});


app.use("/api/jobs", jobRoutes)

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

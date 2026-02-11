import express from "express";
import { createJob, getJobs, getJobById, deleteJob, retryJob, deleteAllJobs } from "../controllers/controllers.js";

const router = express.Router();

router.post("/", createJob);
router.get("/", getJobs);
router.delete("/", deleteAllJobs);
router.get("/:id", getJobById);
router.delete("/:id", deleteJob);
router.post("/:id/retry", retryJob);

export default router;

import express from "express";
import { createJob, getJobs, getJobById, deleteJob } from "../controllers/controllers.js";

const router = express.Router();

router.post("/", createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.delete("/:id", deleteJob);

export default router;

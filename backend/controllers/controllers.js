import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Job name is required" });
    }

    const job = await Job.create({ name, description });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
};

export const getJobs = async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 })
  res.json(jobs)
}

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }
    res.json(job)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id)
    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }
    res.json({ message: "Job deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

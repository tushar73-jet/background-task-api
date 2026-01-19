import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ message: "Job name is required" });
    }

    const job = await Job.create({ name });

    // simulate background task
    setTimeout(async () => {
      job.status = "completed";
      await job.save()
    }, 3000)

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
};

export const getJobs = async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 })
  res.json(jobs)
}

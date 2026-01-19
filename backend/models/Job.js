import mongoose from "mongoose"

const jobSchema = new mongoose.Schema({
  type: String,
  status: {
    type: String,
    default: "pending",
  },
});

export default mongoose.model("Job", jobSchema)
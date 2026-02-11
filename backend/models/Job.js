import mongoose from "mongoose"

const jobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  result: {
    type: Object
  },
  errorDetails: {
    type: String
  }
},
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema)
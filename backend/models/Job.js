import mongoose from "mongoose"

const jobSchema = new mongoose.Schema({
    name:{
  type: String,
  required:true},

  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
},
{ timestamps: true }
);

export default mongoose.model("Job", jobSchema)
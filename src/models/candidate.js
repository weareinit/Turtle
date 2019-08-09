import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  levelOfStudy: { type: String, required: true },
  email: { type: String, required: true },
  resume: { type: String, required: true },
  company: { type: String, required: true },
  timestamp: { type: Date, default: new Date() }
});

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;

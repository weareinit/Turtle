import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  skills: { type: String, required: true },
  timestamp: { type: Date, default: new Date() }
});

const Mentor = mongoose.model("Mentor", mentorSchema);

export default Mentor;

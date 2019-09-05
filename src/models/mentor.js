import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: String, required: true },
  organization: { type: String, required: true },
  mentored: { type: String, required: true },
  skills: { type: String, required: true },
  elaborate: { type: String, required: true },
  shirtSize: { type: String, required: true },
  availability: { type: String, required: true },
  mlhCOC: { type: String, required: true },
  timestamp: { type: Date, default: new Date() }
});

const Mentor = mongoose.model("Mentor", mentorSchema);

export default Mentor;

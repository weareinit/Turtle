import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  timestamp: { type: Date, default: new Date() }
});

const Volunteers = mongoose.model("Volunteer", volunteerSchema);

export default Volunteers;

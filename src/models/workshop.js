import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: new Date() }
});

const Workshop = mongoose.model("Workshop", workshopSchema);

export default Workshop;

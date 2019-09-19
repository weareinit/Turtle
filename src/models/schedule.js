import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  description: { type: String, default: "" },
  title: { type: String, default: "" },
  startTime: { type: String },
  endTime: { type: String },
  location: { type: String, default: "" },
  presenters: { type: [String],  default: [] }
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;

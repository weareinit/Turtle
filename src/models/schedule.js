import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  host: { type: String, required: true },
  logo: { type: String },
  category: { type: String },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true }
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;

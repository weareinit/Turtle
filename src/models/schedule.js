import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  host: { type: String, required: true },
  timeCreated: { type: String},
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true }
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;

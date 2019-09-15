import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  organizer: { type: String, required: false },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: String, required: true }
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;

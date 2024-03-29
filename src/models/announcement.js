import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  body: { type: String },
  sentTime: { type: String },
});

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;

import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  logo: { type: String },
  description: { type: String },
  jobsite: { type: String }
});

const Sponsor = mongoose.model("Sponsor", sponsorSchema);

export default Sponsor;

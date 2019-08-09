import mongoose from "mongoose";

const expoTokenSchema = new mongoose.Schema({
  token: { type: String }
});

const ExpoToken = mongoose.model("Token", expoTokenSchema);

export default ExpoToken;
